import React,{useState,useEffect} from 'react'; 
import axios from 'axios';

const Content = () =>{

    const [value,setvalue] = useState('')
    const [result,setresult] = useState([])
    const [edit,edititem] = useState('')
    const [changevalue,changedvalue] = useState('')
    
    
    function addvalue(e){
        setvalue(e.target.value)
    }

    function submitvalue(){
        const options = {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        };
        
    
    
        axios.post(`https://todo-28281-default-rtdb.firebaseio.com/todo.json`,value,options).then((response)=>{
            console.log("success")
            fetchvalue();
            
        })
    }


    function fetchvalue() {
        axios.get(`https://todo-28281-default-rtdb.firebaseio.com/todo.json`)
            .then((response) => {
                console.log(response.data)
                var arr = []
                const fetchedData =  response.data
                for(const key in fetchedData){
                arr.push({ key:key, value: fetchedData[key] });
                }
                setresult(arr)
                // console.log(result)
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });
    }


    function deletevalue(event,key){
        event.preventDefault()
        axios.delete(`https://todo-28281-default-rtdb.firebaseio.com/todo/${key}.json`).then((response)=>{
            console.log("delete successfully")
            const updatedResult = result.filter(value => value.key !== key);
            setresult(updatedResult);
        })
    }

    function editvalue(event,key){
        event.preventDefault();
        let itemvalue = result.find(item => item.key === key)
        edititem(itemvalue)
        changedvalue(itemvalue.value)
        setvalue(itemvalue.value)
        console.log(result)
    }

    function savechange(e){
        changedvalue(e.target.value)
        
    }

    function savevalue(event, key) {
        event.preventDefault();
    
        
        axios.put(`https://todo-28281-default-rtdb.firebaseio.com/todo/${key}.json`, JSON.stringify(changevalue))
            .then(() => {
                
                const updatedResult = result.map((item) =>
                    item.key === key ? { ...item, value: changevalue } : item
                );
                setresult(updatedResult);
                edititem(''); 
                changedvalue(''); 
            })
            .catch((error) => {
                console.error("Error updating value:", error);
            });
    }
    
    useEffect(()=>{
        fetchvalue()
    },[])

    
    return(
        <>
        <h1 className='text-center mt-5'>TO DO APP</h1>
        <div className='container'>
        <div className="mb-3 d-flex justify-content-center mt-3">
            <input type="text" className="form-control w-50 ml-3" id="basicInput" value={value} onChange={addvalue} placeholder="Enter Task" />
            <input type="button" className="btn btn-success ml-1" value="Add" onClick={submitvalue}/>
        </div>
        <div className=''>
            <table className='table table-bordered table-hover table-striped'>
                <thead>
                    <tr>
                        <th>Si NO.</th>
                        <th>Task.</th>
                        <th>Action.</th>
                    </tr>
                </thead>
                <tbody>
                {result.map((value,index)=>{
                    return  <tr key={index}>
                    <th>{index}</th>
                    {edit.key === value.key?(
                        <td><input type="text" className="form-control w-50" id="basicInput" value={changevalue} onChange={savechange}/></td>
                    ):(
                        <th>{value.value}</th>
                    )}
                    <th>
                        <form>
                            {edit.key === value.key?(
                                <input type='submit' className='btn btn-success m-2' value="save" onClick={(event)=>savevalue(event,value.key)} />
                            ):(
                                <input type='submit' className='btn btn-warning m-2' value="edit" onClick={(event)=>editvalue(event,value.key)} />
                            )}
                            <input type='submit' className='btn btn-danger' value="Delete"  onClick={(event) => deletevalue(event,value.key)}/>
                        </form>
                    </th>
                </tr>   
                   })}
                </tbody>
            </table>
        </div>
        </div>
        </>
    )
}



export default Content;








// import React,{useState,useEffect} from 'react'; 
// import axios from 'axios';

// const Content = () =>{

//     const [value,setvalue] = useState('')
//     const [result,setresult] = useState([])
//     const [edit,edititem] = useState('')
//     const [changevalue,changedvalue] = useState('')
    
//     function addvalue(e){
//         setvalue(e.target.value)
//     }

//     function submitvalue() {
//         const options = {
//             headers: {
//                 'Accept': 'application/json',
//                 'Content-Type': 'application/json'
//             }
//         };
    
//         const payload = { value }; // Wrap the value in an object
    
//         axios.post(`https://todo-8a597-default-rtdb.firebaseio.com/todo.json`, payload, options)
//             .then((response) => {
//                 console.log("success");
//                 setvalue(''); // Clear input field after adding
//                 fetchvalue(); // Refresh the list
//             })
//             .catch((error) => {
//                 console.error("Error adding value:", error);
//             });
//     }
//     function fetchvalue() {
//         axios.get(`https://todo-8a597-default-rtdb.firebaseio.com/todo.json`)
//             .then((response) => {
//                 const fetchedData = response.data;
//                 console.log(fetchedData)
//                 // Handle the case where fetchedData is null
//                 if (!fetchedData) {
//                     setresult([]); // Set result as empty array if no data
//                     return;
//                 }
    
//                 const arr = Object.keys(fetchedData).map(key => ({
//                     key,
//                     value: fetchedData[key].value, // Access `value` field correctly
//                 }));
//                 console.log(arr)
//                 setresult(arr);
//             })
//             .catch((error) => {
//                 console.error("Error fetching data:", error);
//             });
//     }
    
//     function deletevalue(event,key){
//         event.preventDefault()
//         axios.delete(`https://todo-8a597-default-rtdb.firebaseio.com/todo/${key}.json`).then((response)=>{
//             console.log("delete successfully")
//             const updatedResult = result.filter(value => value.key !== key);
//             setresult(updatedResult);
//         })
//     }

//     function editvalue(event, key) {
//         event.preventDefault();
//         const itemvalue = result.find(item => item.key === key);
//         if (itemvalue) {
//             edititem(itemvalue); // Store the item being edited
//             changedvalue(itemvalue.value); // Set the current value for editing
//         }
//     }
    
    

  

//     function savevalue(event, key) {
//         event.preventDefault();
    
//         const payload = { value: changevalue }; // Prepare updated value as object
    
//         axios.put(`https://todo-8a597-default-rtdb.firebaseio.com/todo/${key}.json`, payload)
//             .then(() => {
//                 const updatedResult = result.map((item) =>
//                     item.key === key ? { ...item, value: changevalue } : item
//                 );
//                 setresult(updatedResult);
//                 edititem(''); // Clear the edit state
//             })
//             .catch((error) => {
//                 console.error("Error updating value:", error);
//             });
//     }
    


//     useEffect(()=>{
//         fetchvalue()
//     },[])

  
    
    


 
// return(
//     <>
//     <h1 className='text-center mt-5'>TO DO APP</h1>
//     <div className='container'>
//     <div className="mb-3 d-flex justify-content-center mt-3">
//         <input type="text" className="form-control w-50" id="basicInput" value={value} onChange={addvalue} placeholder="Enter Task" />
//         <input type="button" className="btn btn-success ml-1" value="Add" onClick={submitvalue}/>
//     </div>
//     <div className=''>
//         <table className='table table-bordered table-hover table-striped'>
//             <thead>
//                 <tr>
//                     <th>Si NO.</th>
//                     <th>Task.</th>
//                     <th>Action.</th>
//                 </tr>
//             </thead>
//             <tbody>
//     {result.map((res, index) => (
//         <tr key={res.key}> {/* Use unique key from Firebase */}
//             <th>{index + 1}</th>
//             {edit.key === res.key ? (
//                 <td>
//                     <input
//                         type="text"
//                         className="form-control w-50"
//                         value={changevalue}
//                         onChange={(e) => changedvalue(e.target.value)}
//                     />
//                 </td>
//             ) : (
//                 <td>{res.value}</td>
//             )}
//             <td>
//                 <form>
//                     {edit.key === res.key ? (
//                         <input
//                             type="submit"
//                             className="btn btn-success m-2"
//                             value="Save"
//                             onClick={(event) => savevalue(event, res.key)}
//                         />
//                     ) : (
//                         <input
//                             type="submit"
//                             className="btn btn-warning m-2"
//                             value="Edit"
//                             onClick={(event) => editvalue(event, res.key)}
//                         />
//                     )}
//                     <input
//                         type="submit"
//                         className="btn btn-danger"
//                         value="Delete"
//                         onClick={(event) => deletevalue(event, res.key)}
//                     />
//                 </form>
//             </td>
//         </tr>
//     ))}
// </tbody>

//         </table>
//     </div>
//     </div>
//     </>
// )
// }

// export default Content;







