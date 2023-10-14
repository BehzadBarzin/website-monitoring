/* eslint-disable @typescript-eslint/no-unused-vars */
import axios from "axios";
import { ChangeEvent, useCallback, useEffect, useState } from "react";
import { API_URL } from "../constants/Constants";
import styles from "../constants/styles";
import dayjs from "dayjs";
import PureModal from 'react-pure-modal';
import 'react-pure-modal/dist/react-pure-modal.min.css';
import ReactDiffViewer from 'react-diff-viewer';

type TWebsite = {
  _id: string,
  address: string,
}

type TState = {
  _id: string,
  content: string,
  loadTime: number,
  status: number,
  createdAt: Date,
  updatedAt: Date,
}

enum EStateFields {
  content = 'content',
  loadTime = 'loadTime',
  status = 'status',
}


type TChange = {
  _id: string,
  website: TWebsite,
  previousState: TState,
  currentState: TState,
  fields: EStateFields[],
  createdAt: Date,
  updatedAt: Date,
}


function Home() {

  const [ allWebsites, setAllWebsites ] = useState<TWebsite[]>([]);

  const getWebsites = useCallback(async () => {
    const res = await axios.get(`${API_URL}/websites`);

    if (!res.data) {
      return null;
    }
    const webs: TWebsite[] = [];
    for (const w of res.data) {
      webs.push({
        _id: w._id,
        address: w.address,
      })
    }
    setAllWebsites(webs);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    getWebsites();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ------------------------------------------------------------------------------------------------------------------
  
  const [ selectedWebsite, setSelectedWebsite ] = useState<string | undefined>();

  const onSelectedWebsiteChange = (e: ChangeEvent<HTMLSelectElement>) => {   
    if (e.target.value == '-') return; 
    setSelectedWebsite(e.target.value);
  }


  // ------------------------------------------------------------------------------------------------------------------

  const [ changes, setChanges ] = useState<TChange[]>([]);

  const getChanges = useCallback(async (websiteId: string) => {
    console.log(`Getting Changes for: ${websiteId}`);
    const res = await axios.get<TChange[]>(`${API_URL}/changes/${websiteId}`);
    console.log(`New Changes from API: ${res.data.length}`);

    const newChanges: TChange[] = [];

    if (res.data) {
      for (const c of res.data) {
        const change: TChange = {
          _id: c._id,
          fields: c.fields,
          createdAt: c.createdAt, 
          updatedAt: c.updatedAt,
          website: {
            _id: c.website._id,
            address: c.website.address,
          },
          previousState: {
            _id: c.previousState._id,
            content: c.previousState.content,
            status: c.previousState.status,
            loadTime: c.previousState.loadTime,
            createdAt: c.previousState.createdAt,
            updatedAt: c.previousState.updatedAt,
          },
          currentState: {
            _id: c.currentState._id,
            content: c.currentState.content,
            status: c.currentState.status,
            loadTime: c.currentState.loadTime,
            createdAt: c.currentState.createdAt,
            updatedAt: c.currentState.updatedAt,
          },
        };
        newChanges.push(change);
      }
      

      setChanges(newChanges);

    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!selectedWebsite) {
      return;
    }

    getChanges(selectedWebsite);

  }, [getChanges, selectedWebsite]);

  // ------------------------------------------------------------------------------------------------------------------  

  const [ compareChange, setCompareChange ] = useState<TChange | null>(null);

  const openCompare = useCallback((change: TChange) => {
    setCompareChange(change);
  }, []);

  
  const closeCompare = useCallback(() => {
    setCompareChange(null);
  }, []);

  // ------------------------------------------------------------------------------------------------------------------  
  return (
    <div className={`${styles.boxWidth} ${styles.flexStart} ${styles.padding} flex flex-col justify-start items-center text-white`}>

      {/* Website Select */}
      <div className="block px-4 py-2">
      <label htmlFor="cars" className="">Choose a Website:</label>
      <br />
      <select name="websites" id="websites" onChange={onSelectedWebsiteChange} className="w-96 mt-2 text-black">
      <option key={'-'} value={'-'} className="text-black">Select one</option>
      {
        allWebsites.map((w) => { return (<option key={`${w._id}`} value={`${w._id}`} className="text-black">{w.address}</option>)})
      }
      </select>
      </div>

      {/* Changes Table */}






{/* Table */}
  <div className="relative overflow-x-auto w-11/12">
    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
                <th scope="col" className="px-6 py-3">
                    DateTime
                </th>
                <th scope="col" className="px-6 py-3">
                    Website
                </th>
                <th scope="col" className="px-6 py-3">
                    Status
                </th>
                <th scope="col" className="px-6 py-3">
                    Load Time
                </th>
                <th scope="col" className="px-6 py-3">
                    Content
                </th>
            </tr>
        </thead>
        <tbody>
        {
          changes.map((change) => {
            return (
              <tr key={change._id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
              <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                  {dayjs(change.createdAt).format('DD/MM/YYYY - HH:mm')}
              </th>
              <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                  {change.website.address}
              </th>
              <td className="px-6 py-4">
                  {
                    change.fields.includes(EStateFields.status) ?
                    <div className="bg-yellow-500 bg-opacity-10 text-orange-700 px-4 py-3 rounded relative text-center">
                      {`${change.previousState.status} → ${change.currentState.status}`}
                    </div>
                    : 
                    `-`
                  }
              </td>
              <td className="px-6 py-4">
                  {
                    change.fields.includes(EStateFields.loadTime) ?
                    <div className="bg-yellow-500 bg-opacity-10 text-orange-700 px-4 py-3 rounded relative text-center">
                      {`${change.previousState.loadTime} → ${change.currentState.loadTime}`}
                    </div>
                    : 
                    `-`
                  }
              </td>
              <td className="px-6 py-4">
                  {
                    change.fields.includes(EStateFields.content) ?
                    <div>
                      <button 
                        className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded"
                        onClick={() => openCompare(change)}>
                          Changed: Compare
                        </button>
                      <PureModal
                        // header="Your header"
                        // footer={}
                        width="90vw"
                        isOpen={compareChange !== null}
                        closeButton="X"
                        closeButtonPosition="header"
                        onClose={() => {
                          closeCompare();
                          return true;
                        }}
                      >
                        <ReactDiffViewer 
                            oldValue={change.previousState.content} 
                            newValue={change.currentState.content} 
                            splitView={true} />
                      </PureModal>
                    </div>
                    : 
                    `-`
                  }
              </td>
          </tr>
            );
          })
        }
        </tbody>
    </table>
</div>






    </div>
  )
}

export default Home