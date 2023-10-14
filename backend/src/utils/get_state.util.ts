import axios from 'axios';
import { IWebsite } from '../models/website.model';
import log from './logger.util';
import { AxiosError } from 'axios';
import { IStateInsert } from '../models/state.model';
import { prettyPrint } from 'html';

const selectBodyRegex = /^[\s\S]*<body[^\>]*>([\s\S]*)<\/body>[\s\S]*$/;
const selectScriptRegex = /<script[\s\S]*?>[\s\S]*?<\/script>/g;
const selectStyleRegex = /<style[\s\S]*?>[\s\S]*?<\/style>/g;

function clean(html: string): string {
    let justBodyContent: string = html.match(selectBodyRegex)![1];
    // Remove Script Tag and its contents
    let clean: string = justBodyContent.replace(selectScriptRegex, '');
    // Remove Style Tag and its contents
    clean = clean.replace(selectStyleRegex, '');

    return prettyPrint(clean, {indent_size: 2});
}

export async function getState(website: IWebsite): Promise<IStateInsert | null> {    
    let state: IStateInsert | null = null;
    try {   
        const start = new Date();

        const response = await axios.get(website.address);
        
        const end = new Date();
        
        state = {
            website: website._id,
            content: clean(response.data),
            status: response.status,
            loadTime: end.getTime() - start.getTime(),
        };
    } catch (e) {
        if (e instanceof AxiosError) {
            let status: number;
            if (e.response) {
                status = e.response.status;
            } else {
                if (e.code?.includes('ENOTFOUND')) status = 404;
                else status = 500;
            }

            state = {
                website: website._id,
                content: 'no-content',
                status: status,
                loadTime: -1,
            };
          } else {
              log.error(e);
              return null;
          }
    }

    return state;
}