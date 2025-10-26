import  { useEffect, useState } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa'; 
import Tasks from '../Tasks/Tasks';
import {db} from '../../config/firebase';
import {getDocs, collection, query, where, deleteDoc, writeBatch, doc} from 'firebase/firestore';
import AddNewTaskForm from '../AddNewTask/AddNewTaskForm';

const containerStyle = {
  border: '1px solid #ddd',
  borderRadius: 6,
  margin: '1%',
  background: '#edede6',
  color: 'black',
  padding: '1%'
};

const headerStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '10px 15px',
};

const ExpandCollapse = ({id, title, setEvents }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [showAddTaskForm, setShowAddTaskForm] = useState(false);

  const tasksRef= collection(db, 'tasks');
  const eventsCollectionRef = collection(db, 'events');

  const expandCollapseEventHandler = () => {
    setIsOpen(!isOpen);
  }

  const addNewTaskHandler = () => {
    setShowAddTaskForm(!showAddTaskForm);
  }

  const getTasks = async () => {
         try {
           const q = query(tasksRef, where('eventId', '==', id));
           const data = await getDocs(q);
           const tasksData = data.docs.map(doc => ({
             id: doc.id,
             ...doc.data()
           }));
           setTasks(tasksData);
         } catch (error) {
           console.error("Error fetching tasks: ", error);
         }
       };

  useEffect(() => {
     return () => getTasks();
  }, []);

  const deleteEventHandler = async () => {
        try {
            const q = query(tasksRef, where('eventId', '==', id));
            const taskData = await getDocs(q);
            const batch = writeBatch(db);
            let taskCount = 0;
            taskData.forEach((taskDoc) => {
            // Add each task document reference to the batch for deletion
                batch.delete(taskDoc.ref);
                taskCount++;
            });
            const eventDocRef = doc(db, "events", id);
            batch.delete(eventDocRef);
            // Commit the batch
            await batch.commit();
        } catch (error) {
            console.error("Error deleting event and tasks: ", error);
            alert("Error deleting event and tasks. Please try again.");
            return;
        }
            // Refresh events list
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
            alert("Event and associated tasks deleted successfully.");
  }

  return (
    <div style={containerStyle}>
        <div style={headerStyle}>
            <button onClick={deleteEventHandler}>Delete Event</button>
            <button onClick={addNewTaskHandler}>{!showAddTaskForm ? 'Add a Task': 'Close Form'}</button>
        </div>
        <div style={headerStyle}>
            <h1>{title}</h1>  
            <button onClick={expandCollapseEventHandler} aria-expanded={isOpen}>{isOpen ? <> <FaChevronUp /></>:<>  <FaChevronDown /></>}</button>
        </div>
        {showAddTaskForm && <AddNewTaskForm id={id} setShowAddTaskForm= {setShowAddTaskForm} setTasks={setTasks}/>}
        {isOpen && (
            tasks.length === 0 ?
            <div>No task found.</div> : (
             tasks.map((task) => (   
                <Tasks key = {task.id} task= {task} getTasks={getTasks}/>
             ))
            )
        )}
    </div>
  );
};

export default ExpandCollapse;
