import { useState, useEffect } from 'react';
import {db} from '../../config/firebase';
import {getDocs, collection, addDoc} from 'firebase/firestore';
import ExpandCollapse from './ExpandCollapse';

// --- Styling (simplified for inline use) ---
const styles = {
  container: { padding: '5%', fontFamily: 'Arial, sans-serif', display: 'flex' },
  header: { borderBottom: '2px solid #ccc', paddingBottom: '10px' },
  form: { marginBottom: '20px', padding: '15px', border: '1px solid #eee', borderRadius: '5px' },
  input: { padding: '8px', marginRight: '10px', border: '1px solid #ccc', borderRadius: '3px' },
  button: { padding: '8px 15px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer' },
  eventItem: { border: '1px solid #ddd', padding: '15px', marginBottom: '10px', borderRadius: '5px', cursor: 'pointer', backgroundColor: '#f9f9f9' },
  activeEvent: { backgroundColor: '#e0f7fa', borderLeft: '5px solid #00bcd4' }
};

const containerStyle = {
  border: '1px solid #ddd',
  borderRadius: 6,
  margin: '1%',
  background: '#fcf5d6ff',
  color: 'black',
  padding: '2% 5%'
};

const Events = () => {
  const [events, setEvents] = useState([]);
  const [showAddEventForm, setShowAddEventForm] = useState(false);
  const [newEvent, setNewEvent] = useState('');

  const eventsCollectionRef = collection(db, 'events');


  useEffect(() => {
    const getEvents = async () => {
      try {
        const data = await getDocs(eventsCollectionRef);
        const eventsData = data.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setEvents(eventsData);
      } catch (error) {
        console.error("Error fetching events: ", error);
      }
    };
  return () => getEvents();
  },[]);

  const handleAddEvent =  () => {
    setNewEvent('');
    setShowAddEventForm(!showAddEventForm);
  }

  const handleChange = (e) => {
    const { value } = e.target;
    setNewEvent(value);
  }

  const addEvent = async () => {
    if (newEvent.trim() === '') {
      alert('Event name cannot be empty.');
      return;
    }
    try {
      await addDoc(eventsCollectionRef, { title: newEvent });
      setNewEvent('');
      setShowAddEventForm(false);
      // Refresh events list
      const data = await getDocs(eventsCollectionRef);
      const eventsData = data.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setEvents(eventsData);
    } catch (error) {
      console.error("Error adding event: ", error);
    }
  }

  return (
    <div style={styles.container}>
      <div style={{ width: '100vw' }}>
        <div style={{marginBottom: '2%'}}>
          <button onClick={handleAddEvent}>{!showAddEventForm? 'Add an Event': 'Close Event Form'}</button>
        </div>
        {showAddEventForm && (
          <div style={containerStyle}>
            <div style={{display: 'flex', flexDirection: 'column', gap: '2rem', marginBottom: '2rem'}}>
                <div>
                  <label htmlFor="task">Title</label>
                </div>
                <div>
                  <input
                      type="text"
                      id="task"
                      name="task"
                      value={newEvent}
                      onChange={handleChange}
                      style={{ width: '100%', height: '3rem', fontSize: '18px', boxSizing:'border-box' }} 
                      required
                  />
                </div>
                <div>
                  <button style={styles.button} onClick={addEvent}>Add Event</button>
                </div>
              </div>
          </div>
        )}
        <div style={{width: '100%', marginTop: 20 }}>
          {events.length === 0 ? (
            <h1>No events found. Please click on add event to get started</h1>
          ) : (
            events.map(ev => (
              <ExpandCollapse key={ev.id} id = {ev.id} title={ev.title || 'Untitled event'} setEvents={setEvents}/>
            ))
          )}
        </div>
      </div>
    </div>
  );

};

export default Events;