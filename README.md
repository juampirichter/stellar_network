Step by step:
1- Install Node.js in your computer (Recommended version).

2- Create a main folder and inside create one called 'stellar_network', open the VSCode in the folder 'stellar_network' and create a new terminal.

3- Type 'cd ..' then 'npm init vite' and in Proyect Name put 'stellar_network'. Select 'Vue' and 'Typescript'.

4- After installing Vue and Typescript, type 'cd stellar_network' and 'npm init -y' in the terminal. Then 'npm install'.

5- Go to the vite.config.ts file, remove the ',' at the end of 'plugins: [vue()]'. Then above plugins put 'server: {open: true},'

6- Now to install Quasar, put in the terminal 'npm install --save quasar @quasar/extras' and then 'npm install --save-dev @quasar/vite-plugin sass@^1.33.0'

7- Go to the main.ts file and under 'import App from "./App.vue"', put
    import { Quasar } from 'quasar'
    import '@quasar/extras/material-icons/material-icons.css'
    import '@quasar/extras/fontawesome-v6/fontawesome-v6.css'
    import 'quasar/src/css/index.sass'

8- Then in the same file, where it says 'createApp(App)', replace it with:
    createApp(App)
        .use(Quasar, {
            plugins: {}, // import Quasar plugins and add here
        })
        .mount('#app')

9- Go back to the vite.config.ts file and import the following line:
    import { quasar, transformAssetUrls } from '@quasar/vite-plugin'
And in the plugins part, replace with the following:
    plugins: [
        vue({
        template: { transformAssetUrls }
        }),
        quasar({
        sassVariables: 'src/quasar-variables.sass'
        })
    ]

10- Now create a new file in src folder with name 'quasar-variables.sass' and don't put anything inside

11- In the terminal type 'npm install stellar-sdk'

12- Open style.css and delete all the content inside

13- With everything installed, inside the src folder, replace the App.vue file with the equivalent on GitHub. Also, in the components folder, put all the files found on GitHub from that folder

14- In the terminal type 'npm run dev' and the page will open in the browser
