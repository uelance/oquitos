// ! THIS CODE ISN'T MADE TO BE EXTREMLY SAFE, IT'S ONLY A DEMOSTRATION OF HOW TO MAKE A 
// ! ROOSTER TABLE WEBPAGE, YOU CAN USE THE SAME APPROACH AND FUNCTIONS TO IMPLEMENT IT IN
// ! ANY OTHER FRAMEWORK 😄💀

const public_anon_key = 'SUPABASE_ANON_KEY 💀';
const get = (id) => document.getElementById(id);

const { createClient } = supabase
const sdb = createClient('SUPABASE_URL', public_anon_key);

const forEachList = [];
const statusOrder = {
    'dangerous': 1,
    'care needed': 2,
    'normal': 3
};

const updateReports = async ( ) => {
    await sdb.from('reports').select('*').then((value) => {
        const container = get('container');
        value.data.sort((a, b) => {
            // First, compare by reported_at (newest first)
            if (new Date(a.reported_at) > new Date(b.reported_at)) return -1;
            if (new Date(a.reported_at) < new Date(b.reported_at)) return 1;
            
            // If reported_at is equal, compare by status
            const levelA = statusOrder[a.level];
            const levelB = statusOrder[b.level];
            
            return levelB - levelA;
        }).forEach((r) => {
            if ( forEachList.includes(r.id) ) return;

            forEachList.push(r.id);
            const date = new Date(r.reported_at);
            container.innerHTML += `
            <at>${date.getMonth()+1}/${date.getDate()} - ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}</at>
            <content>${r.content}</content>
            <status class='${r.level}'>${r.level}</status>
            `
        });
    });
}; 

updateReports();
setInterval(( ) => updateReports(), 1024);