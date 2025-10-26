import { useState } from 'react';
import {getDocs, collection, query,  where, addDoc} from 'firebase/firestore';
import {db} from '../../config/firebase';

// Define the available status options
const STATUS = [
  'Pending',
  'In Progress',
  'Complete',
  'Canceled'
];

const containerStyle = {
  border: '1px solid #ddd',
  borderRadius: 6,
  margin: '1%',
  background: '#ffffffff',
  color: 'black',
  padding: '1%'
};

const AddNewTaskForm = ({id, setShowAddTaskForm, setTasks}) => {
    // State to hold all form data
  const [taskData, setTaskData] = useState({
    task: '',
    createdBy: '',
    createdFor: '',
    status: STATUS[0], // Default to 'Pending'
    note: ''
  });
  const tasksRef= collection(db, 'tasks');

    // Universal handler for all input and select changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setTaskData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };


    const addNewTask = async (taskData) => {
      if(taskData.task.trim() === '' || taskData.createdBy.trim() === '' || taskData.createdFor.trim() === '') {
        alert('Fields cannot be empty.');
        return;
      }
      try {
        await addDoc(tasksRef, {
        work: taskData.task,
        createdBy: taskData.createdBy,
        createdFor: taskData.createdFor,
        status: taskData.status,
        note: taskData.note,
        eventId: id
      });
      setShowAddTaskForm(false);
      setTaskData({
        task: '',
        createdBy: '',
        createdFor: '',
        status: STATUS[0], // Reset to 'Pending'
        note: ''
      });
      // Refresh tasks list
      const q = query(tasksRef, where('eventId', '==', id));
      const data = await getDocs(q);
      const tasksData = data.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setTasks(tasksData);
      } catch (error) {
          console.error("Error task: ", error);
      }
    };

    return (
    <div style={containerStyle}>
        <div style={{display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '15px'}}>
        {/* Task */}
        <div>
          <div>
            <label htmlFor="task">Task Description:</label>
          </div>
          <div>
            <input
                type="text"
                id="task"
                name="task"
                value={taskData.task}
                onChange={handleChange}
                style={{ width: '100%', height: '3rem', fontSize: '18px' }} 
                required
            />
          </div>
        </div>
        {/* Created By */}
        <div >
            <div>
            <label htmlFor="createdBy">Created By:</label>
            </div>
            <div>
            <input
                type="text"
                id="createdBy"
                name="createdBy"
                value={taskData.createdBy}
                onChange={handleChange}
                style={{ width: '100%', height: '3rem', fontSize: '18px' }}
                required
            />
            </div>
        </div>
        {/* Created For */}
        <div >
            <div>
            <label htmlFor="createdFor">Assigned To:</label>
            </div>
            <div>
            <input
                type="text"
                id="createdFor"
                name="createdFor"
                value={taskData.createdFor}
                onChange={handleChange}
                style={{ width: '100%', height: '3rem', fontSize: '18px' }}
                required
            />
            </div>
        </div>
        {/* Status */}
        <div >
            <div>
            <label htmlFor="status">Status:</label>
            </div>
            <div>
            <select
                id="status"
                name="status"
                value={taskData.status}
                onChange={handleChange}
                style={{ width: '100%', height: '3rem', fontSize: '18px' }}
                required
            >
                {STATUS.map(status => (
                <option key={status} value={status}>{status}</option>
                ))}
            </select>
            </div>
        </div>
        {/* Note */}
        <div>
            <div>
            <label htmlFor="note">Note</label>
            </div>
            <div>
            <input
                type="text"
                id="note"
                name="note"
                value={taskData.note}
                onChange={handleChange}
                style={{ width: '100%', height: '3rem', fontSize: '18px' }}
                required
            />
            </div>
        </div>
        </div>
        {/* Button */}
        <div>
            <button onClick= {() => addNewTask(taskData)}>
              Save Task
            </button>
        </div>
    </div>
  );
}

export default AddNewTaskForm;