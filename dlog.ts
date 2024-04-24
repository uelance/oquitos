import { SupabaseClient, createClient } from '@supabase/supabase-js';
import chalk from 'chalk';

type dlargs = string | number | string[] | number[] | object | object[] | [];
type dcolors = 'white' | 'blue' | 'red' | 'yellow';
type levels = 'inf' | 'log' | 'wrn' | 'err';

class sdb {
    url: string = '';
    key: string = '';
    sdb: SupabaseClient | undefined;

    constructor(url: string, anon_key: string) {
        this.url = url;
        this.key = anon_key;
    }

    public initSupabase = () => {
        this.sdb = createClient(this.url, this.key);
    }

    createReport = async ( name: string, content: dlargs, level: levels ) => {
        // Reports table
        const rtable = this.sdb?.from('reports');

        return await rtable?.insert({
            name,
            content,
            level: (level == 'inf' || level == 'log') ? 'normal' : level == 'wrn' ? 'care needed' : 'dangerous',
        }).then((value) => value.status);
    }
}

class log {
    public static mgen = ( color: dcolors, text: string ): string => {
        const date: Date   = new Date();
        const time: string = `${date.getMonth()+1}/${String(date.getDate()).padStart(2, '0')}:${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;

        switch ( color ) {
            case 'white':
                return chalk.bgMagentaBright.black(`[${time}] ${text}`);

            case 'blue':
                return chalk.bgBlue.black(`[${time}] ${text}`);

            case 'red':
                return chalk.bgRed.black(`[${time}] ${text}`);

            case 'yellow':
                return chalk.bgYellow.black(`[${time}] ${text}`);
        }
    }

    public log = ( args: dlargs ) => console.log(log.mgen('blue'  , 'LOG'), args);
    public inf = ( args: dlargs ) => console.log(log.mgen('white' , 'INF'), args);
    public wrn = ( args: dlargs ) => console.log(log.mgen('yellow', 'WRN'), args);
    public err = ( args: dlargs ) => console.log(log.mgen('red'   , 'ERR'), args);
}

class sar implements log {
    private nlg = new log();
    private p_sdb_c: sdb | undefined;
    private p_sdb_r: (name: string, content: dlargs, level: levels) => Promise<number | undefined>;

    constructor(oquitos_key: string, supabase_url: string, supabase_anon_key: string) {
        if ( oquitos_key.trim().length < 32 || oquitos_key.match(/\s+/g) ) throw this.nlg.err('An oquitos api key can\'t have any spaces and length should be 32（＞人＜；）');

        this.p_sdb_c = new sdb(supabase_url, supabase_anon_key);   
        this.p_sdb_c.initSupabase();
        
        this.p_sdb_r = async (n, c, l) => this.p_sdb_c?.createReport(n, c, l);
    }

    private send_to_api = async ( args: dlargs, type: 'log' | 'inf' | 'err' | 'wrn' ) => {
        const gen_code = ( code: number ) => {
            if ( code >= 200 && code <= 210 ) return chalk.bgGreen(`[${code}]`);
            return chalk.bgRedBright(`[${code}]`);
        } 

        const report_code = await this.p_sdb_r('OQUITOS', args, type) || 400;
        return gen_code(report_code);
    }

    // SLAPI stands for (Sent log to api)
    public log: (args: dlargs) => void = async (args) => {
        const code = await this.send_to_api(args, 'log');
        this.nlg.log(`↻ SLAPI ${code}`);
        this.nlg.log(args);
    };

    public inf: (args: dlargs) => void = async (args) => {
        const code = await this.send_to_api(args, 'inf');
        this.nlg.inf(`↻ SLAPI ${code}`);
        this.nlg.inf(args);
    };

    public wrn: (args: dlargs) => void = async (args) => {
        const code = await this.send_to_api(args, 'wrn');
        this.nlg.wrn(`↻ SLAPI ${code}`);
        this.nlg.wrn(args);
    };

    public err: (args: dlargs) => void = async (args) => {
        const code = await this.send_to_api(args, 'err');
        this.nlg.err(`↻ SLAPI ${code}`);
        this.nlg.err(args);
    };
};

class oquitos {
    private key: string = '';
    private supabase_url: string = '';
    private supabase_anon_key: string = '';

    constructor(supabase_url: string, supabase_anon_key: string) {
        this.supabase_url = supabase_url;
        this.supabase_anon_key = supabase_anon_key;
    }

    public nar: log | undefined; // Declare nar as type log
    public sar: sar | undefined; // Declare sar as type sar

    public nar_init() {
        // Create an instance of log and assign it to nar
        this.nar = new log();
    }

    public sar_init() {
        // Create an instance of sar and assign it to sar
        this.sar = new sar(this.key, this.supabase_url, this.supabase_anon_key);
    }
}

export { oquitos };

