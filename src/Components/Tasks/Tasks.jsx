import  { useState } from 'react';
import { FaEdit } from 'react-icons/fa'
import { db } from '../../config/firebase';
import {  updateDoc, doc } from 'firebase/firestore';
import './Tasks.css';
import { STATUS_OPTIONS } from '../../constants';

const styles = {
	list: { listStyle: 'none', padding: 0, margin: 0 },
	item: {margin:'1%', paddingBottom: '1%', borderBottom: '1px solid #eee' },
	empty: { color: '#666', fontStyle: 'italic' }
};

const STATUS = [
  'Pending',
  'In Progress',
  'Complete',
  'Canceled'
];

const Tasks = ({ task, getTasks}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [taskData, setTaskData] = useState({
        task: task.work,
        createdBy: task.createdBy,
        createdFor: task.createdFor,
        status: task.status, // Default to 'Pending'
        note: task.note
    });

    // Universal handler for all input and select changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setTaskData(prevData => ({
        ...prevData,
        [name]: value,
        }));
    };
	
    const editButtonHandler = () => {
        setIsEditing(!isEditing);
    }

    const onSubmitButtonHandler = async () => {
        console.log('Submitting edited task :', task);
        console.log('Submitting edited task data:', taskData);
        // Logic to submit the edited task data to Firestore goes here
        try {
            const taskDocRef = doc(db, "tasks", task.id);
            await updateDoc(taskDocRef, {
                work: taskData.task,
                createdBy: taskData.createdBy,
                createdFor: taskData.createdFor,
                status: taskData.status,
                note: taskData.note
            });
            setIsEditing(false);
            getTasks();
        } catch (error) {
            console.error("Error updating task: ", error);
        }
    }

    let renderedContent;

    if(!isEditing){
        renderedContent = (
            <div  style={task.status === STATUS_OPTIONS.IN_PROGRESS ? {backgroundColor: '#fff3cd'} :
             task.status === STATUS_OPTIONS.COMPLETE ? {backgroundColor: '#d4edda'} :
             task.status === STATUS_OPTIONS.CANCELED ? {backgroundColor: '#f5abb1ff'} : {backgroundColor: '#f9a88dff'}}>
                <div className="task-container">
                    <div><b>Task:</b> {task.work}</div>
                    <div><b>Created By:</b> {task.createdBy}</div>
                    <div ><b>Created For:</b> {task.createdFor}</div>
                    <div ><b>Status :</b> {task.status}</div>
                    <button onClick={editButtonHandler} ><FaEdit style={{cursor: 'pointer'}}/></button>
                </div>
                <div style={styles.item}><b>Note:</b> {task.note}</div>
            </div>
        )
    }else{
        renderedContent = (
            <div  style={task.status === STATUS_OPTIONS.IN_PROGRESS ? {backgroundColor: '#fff3cd'} :
             task.status === STATUS_OPTIONS.COMPLETE ? {backgroundColor: '#d4edda'} :
             task.status === STATUS_OPTIONS.CANCELED ? {backgroundColor: '#f5abb1ff'} : {backgroundColor: '#f9a88dff'}}>
                <div className="task-container">
                    <div><b>Task:</b> 
                        <input
                            type="text"
                            id="task"
                            name="task"
                            value= {taskData.task}
                            placeholder={task.work}
                            onChange={handleChange}
                            style={{ width: '100%', height: '3rem', fontSize: '18px' }} 
                            required
                        />
                    </div>
                    <div><b>Created By:</b>
                         <input
                            type="text"
                            id="createdBy"
                            name="createdBy"
                            value= {taskData.createdBy}
                            placeholder={task.createdBy}
                            onChange={handleChange}
                            style={{ width: '100%', height: '3rem', fontSize: '18px' }} 
                            required
                        />
                    </div>
                    <div ><b>Created For:</b>
                        <input
                            type="text"
                            id="createdFor"
                            name="createdFor"
                            value= {taskData.createdFor}
                            placeholder={task.createdFor}
                            onChange={handleChange}
                            style={{ width: '100%', height: '3rem', fontSize: '18px' }} 
                            required
                        />
                    </div>
                    <div ><b>Status :</b>
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
                <div style={styles.item}><b>Note:</b> 
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
                <div style={{display: 'flex', gap: '1rem', margin: '1rem', justifyContent: 'space-evenly', paddingBottom: '1rem'}}>
                    <button onClick={editButtonHandler} >Cancel</button>
                    <button onClick={onSubmitButtonHandler} >Save</button>
                </div>
            </div>
        )
    }


    return  renderedContent; 
    
};

export default Tasks;
