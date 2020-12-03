import React from 'react'
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import axios from 'axios';

function StudentComponent(props) {
    function editMe() {
        let url = `http://localhost:5000/student/`;
        window.location=`/lecturer/edit/${props.current._id}`;
    }
    function deleteMe() {
        console.log(props.current.lastname);
        let url = `http://localhost:5000/student/`;
        axios.delete(url, { params: { id: props.current._id } })
            .then((res) => {
                console.log(res.data.message);
                props.refrehStuTable(props.current._id);
            })
            .catch((err) => { console.log(err.data.message) })
    }
    function clikedOnMe() {
        props.myId(props.current._id);//my private ID
        props.myIndex(props.index);//my Index in local array
        props.showMe();//go to student Details Comonent
        // console.log(document.documentElement.scrollTop)//for scroll
    }
    return (
            <tr id={`student${props.index}`}>
                <td><img src={`/studentImages/${props.current.pic}`} alt="" onClick={() => clikedOnMe()} /></td>
                <td>{props.current.firstname} {props.current.lastname}</td>
                <td>{props.current.gender}</td>
                <td>{props.current.email}</td>
                <td>{props.current.id}</td>
                <td><div style={{ "display": "grid", "grid-template-columns": "40px 40px", "margin-left": "10px" }}>
                    <DeleteIcon color="primary" onClick={() => deleteMe()} /><EditIcon color="primary" onClick={() => editMe()} />
                </div></td>
            </tr>
    )
}

export default StudentComponent