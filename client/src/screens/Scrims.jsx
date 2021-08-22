import { useContext, useState, useEffect, Fragment } from 'react';
import ScrimSection from '../components/ScrimSection';
import { CurrentUserContext } from '../context/currentUser';
import { getAllScrims } from './../services/scrims';

export default function Scrims() {
  const [currentUser] = useContext(CurrentUserContext);
  const [scrims, setScrims] = useState([]);
  const [fetch, toggleFetch] = useState(false);

  useEffect(() => {
    const fetchScrims = async () => {
      console.log('fetching scrims');
      const scrimsData = await getAllScrims();

      const today = new Date().toLocaleDateString();
      const todaysScrims = scrimsData.filter(
        ({ gameStartTime }) =>
          new Date(gameStartTime).toLocaleDateString() === today
      );

      setScrims(todaysScrims);
    };

    fetchScrims();
  }, [fetch]);

  return (
    <div>
      <div className="page-section">
        <div className="inner-column">
          <h1>home</h1>
          <h2>welcome:</h2>
          {currentUser && (
            <pre className="text-white">
              {JSON.stringify(currentUser, null, 2)}
            </pre>
          )}
        </div>
      </div>
      <div id="scrims-container">
        {scrims.map((scrim, idx) => (
          <Fragment key={idx}>
            <ScrimSection
              scrim={scrim}
              idx={idx}
              toggleFetch={toggleFetch}
              setScrims={setScrims}
            />
            <div className="page-break"></div>
          </Fragment>
        ))}
      </div>
    </div>
  );
}
