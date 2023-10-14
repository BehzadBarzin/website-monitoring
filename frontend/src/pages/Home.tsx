/* eslint-disable @typescript-eslint/no-unused-vars */
import axios from "axios";
import { ChangeEvent, useCallback, useEffect, useState } from "react";
import { API_URL } from "../constants/Constants";
import styles from "../constants/styles";

type TWebsite = {
  _id: string,
  address: string,
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

  

  // ------------------------------------------------------------------------------------------------------------------
  
  const [ selectedWebsite, setSelectedWebsite ] = useState<TWebsite | undefined>();

  const onSelectedWebsiteChange = (e: ChangeEvent<HTMLSelectElement>) => {
    console.log(e.target.value);
  }


  // ------------------------------------------------------------------------------------------------------------------  
  return (
    <div className={`${styles.boxWidth} ${styles.flexStart} ${styles.padding} flex flex-col justify-start items-center text-white`}>

      {/* Website Select */}
      <div className="block px-4 py-2">
      <label htmlFor="cars" className="">Choose a Website:</label>
      <br />
      <select name="websites" id="websites" onChange={onSelectedWebsiteChange} className="w-96 mt-2 text-black">
      {
        allWebsites.map((w) => { return (<option value={`${w._id}`} className="text-black">{w.address}</option>)})
      }
      </select>
      </div>

    </div>
  )
}

export default Home