# oquitos

Oquitos is the official application that is used to debug, track &amp; list uelance.com errors &amp; problems for users across the word. It's also under GNU 3.0 license.

## Example

`env.ts`:

```ts
const env = process.env as {
    SUPABASE_KEY: string
    SUPABASE_URL: string
} & typeof process.env;

export { env };
```

### Using sar (Which registers it in the database)

`index.ts`

```ts
import { oquitos } from './dlog';
import { env } from './env';

const oq = new oquitos(
    env.SUPABASE_URL, env.SUPABASE_KEY
);

oq.sar_init();

oq.sar?.inf('This is just information too!');
oq.sar?.err('This is an error! It should indicate it in the rooster page!');
oq.sar?.wrn('Well, This is a warning (who cares, its just a warning until its a memory leak 💀)')
```

### Using nar (Which doesn't register in the database)

`index.ts`

```ts
import { oquitos } from './dlog';
import { env } from './env';

const oq = new oquitos(
    '', ''
);

oq.nar_init();

oq.nar?.inf('This is just information too!');
oq.nar?.err('This is an error! It should indicate it in the rooster page!');
oq.nar?.wrn('Well, This is a warning (who cares, its just a warning until its a memory leak 💀)')
```

## Why use it over sentry?

Completely free, You can use it in **any framework**. Hosting the rooster website is also easier & customizable, You can either host it on [**netlify**](https://netlify.com) or [**vercel**](https://vercel.com) or on any other hosting. It just works!

You can also use it with other programming languages, Not only `js`/`ts`, But you need to write oquitos wrapper or just see if there's an existing one for it!

## What is rooster

Rooster is our cute name for "oquitos report website page", It displays any **sar** logs in it!
You can combine oquitos with [**Tauri**](https://tauri.app), [**Electron**](https://electronjs.org) or even a **web page** to have a report of the errors your users are occurring.

## I still don't get how to use it

Alright, Basically for example of a webpage. You just need to add a `try & catch` in your code for each  code you've writter and a `catch` method to your promises. Or just use the `window.onerror` event then use oquitos inside of it.

### Example code

`index.jsx (sar)`

```jsx
/// ... importing react
/// ... importing oquitos

function component() {
    /// ... react component example
    // ... use effect maybe, idk

    // Setup an oquitos client
    const oq = new oquitos(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
    // Initialize sar
    oq.sar.init();

    // Report the error
    window.onerror = (error) => oq.sar.err(error);

    return <img src="^" alt="error image!"/>;
}
```

## Why is it free

As mentioned before, If you didn't conclude all the text on the top, Then it's free because it's self-hosted & uses free databases. Which doesn't coast us anything.

## License is harsh

We chose this license because this project wasn't meant to be public, It was supposed to be fully closed-source for uelance only. But here we go!

### What you should do is

#### *please check it each week, we could change the license later on based on the ceo's opinion. We can't do anything on our own from ourselves.*
