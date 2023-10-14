import { ChangeEvent, FormEvent, useCallback, useEffect, useState } from "react";
import styles from "../constants/styles"
import axios from "axios";
import { API_URL } from "../constants/Constants";
import { useAuthHeader, useIsAuthenticated } from "react-auth-kit";

type TWebsite = {
  _id: string,
  address: string,
}

function Websites() {
  const [address, setAddress] = useState<string>('');

  //  callback to handle onChange event on Address input
  const onAddressChange = (e: ChangeEvent<HTMLInputElement>) => {
      setAddress(e.target.value);
  }

  // handles onSubmit of the form
  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    // --------------------------------
    await axios.post(`${API_URL}/websites`, {
      address: address,
    });

    setAddress('');

    // Get a fresh list of all websites
    getWebsites();
  }

  // ------------------------------------------------------------------------------------------------------------------

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
  
  const [ selectedWebsites, setSelectedWebsites ] = useState<string[]>([]);

  // Checks to see if the user is authenticated or not (does it have a token in cookies)
  const isAuthenticated = useIsAuthenticated();

  // Provides 'Bearer xxxx' header value based on the token saved in cookies by 'react-auth-kit' library
  const authHeader = useAuthHeader();

  
  // On the first render get the user's selected websites from server and set them
  // This way user's filters will persist throughout logins
  useEffect(() => {
    // If not logged in, skip
    if (!isAuthenticated()) return;

    const getWatchList = async () => {
      const res = await axios.get(`${API_URL}/watch-lists`, {
          headers: { Authorization: authHeader() }  // Get auth token string from 'react-auth-kit'
      });

      if (!res.data) {
        return null;
      }

      setSelectedWebsites(res.data.websites);
    }
    getWatchList();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  // ------------------------------------------------------------------------------------------------------------------
  const addWebsiteToUser = useCallback(async (id: string) => {
    // If not logged in, skip
    if (!isAuthenticated()) return;
    await axios.post(`${API_URL}/watch-lists`, {
      website: id,
    }, {
      headers: { Authorization: authHeader() }  // Get auth token string from 'react-auth-kit'
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const removeWebsiteFromUser = useCallback(async (id: string) => {
    // If not logged in, skip
    if (!isAuthenticated()) return;
    await axios.delete(`${API_URL}/watch-lists/${id}`, {
      headers: { Authorization: authHeader() }  // Get auth token string from 'react-auth-kit'
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const removeUserWatchList = useCallback(async () => {
    // If not logged in, skip
    if (!isAuthenticated()) return;
    await axios.delete(`${API_URL}/watch-lists`, {
      headers: { Authorization: authHeader() }  // Get auth token string from 'react-auth-kit'
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Every time a Website checkbox is checked/unchecked
  const onWebsiteChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      // Add website to user's watch list  
      addWebsiteToUser(e.target.name);
        // Change active filters
        setSelectedWebsites((prev) => {
            return [
                ...prev,
                e.target.name
            ]
        });
    } else {
       // Add website to user's watch list  
       if (selectedWebsites.length <= 1) {
        removeUserWatchList();
        setSelectedWebsites([]);
        } else {
        // Change active filters
        removeWebsiteFromUser(e.target.name);
        setSelectedWebsites((prev) => {
          return prev.filter((w) => w != e.target.name)
        });
      }

    }
  
  }

  // Used to determine if a specific Website is selected, make its checkbox checked
  const isWebsiteChecked = (id: string): boolean => {
      return selectedWebsites?.includes(id) || false;
  }


  // ------------------------------------------------------------------------------------------------------------------
  // ------------------------------------------------------------------------------------------------------------------
  return (
    <div className={`${styles.boxWidth} ${styles.flexStart} ${styles.padding} flex flex-col justify-start items-center text-white`}>
      <div className={`flex flex-col justify-start items-center`}>
          <form onSubmit={onSubmit}>
            {/* Website Address */}
            <div className="mb-6">
              <label htmlFor="address" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Website Address:</label>
              <input type="url" id="address" name="address" onChange={onAddressChange} value={address} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 w-96" placeholder="https://www.google.com/" required />
            </div> 
            {/* Submit */}
            <div className={`${styles.flexCenter}`}>
              <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                {'Add'}
              </button>
            </div>
          </form>
        </div>

        <div className={`mt-10 flex flex-col justify-start items-center`}>
            <h4 className="mb-5">
              Websites: 
            </h4>
            <div className="overflow-scroll h-[500px]">
            {
                allWebsites.map((w: TWebsite) => {
                    return (
                        <div key={w._id} className="flex items-center mb-2">
                            <input checked={isWebsiteChecked(w._id)} onChange={onWebsiteChange} name={`${w._id}`} id={`${w._id}`} type="checkbox" value="" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                            <label htmlFor={`${w._id}`} className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">{w.address}</label>
                        </div>
                    )
                })
            }
            </div>
        </div>

    </div>
  )
}

export default Websites