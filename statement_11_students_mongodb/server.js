const http = require('http')
const express = require('express')
const mongoose = require('mongoose')
const StudentMarks = require('./studentmarks')

const app = express();

app.use(express.json());

const db_string = "mongodb+srv://priyanshupict:szo3U7YcJRxa51dc@cluster0.f74m6ts.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const PORT = 5000;

//  test
app.get('/test', async (req, res) => {
    res.send({"message": "Server is running"});
})

// ------------------- Defining routes and controllers  -------------------

//  c) Insert array of documents in above Collection. [Document havefollowing field: Name, Roll_No, WAD_Marks, CC_Marks,DSBDA_Marks,CNS_Marks,AI_marks]
app.post('/add', async (req, res) => {
    const {Name, Roll_No, WAD_Marks, CC_Marks, DSBDA_Marks, CNS_Marks, AI_Marks} = req.body;

    const student = await StudentMarks.create({Name, Roll_No, WAD_Marks, CC_Marks, DSBDA_Marks, CNS_Marks, AI_Marks});
    res.send({"message": "Student Createde Successfully", student})
})

// d) Display total count of documents and List all the documents inbrowser.
app.get('/displaycountanddocuments', async (req, res) => {
    
    const students = await StudentMarks.find();
    res.send({"The total number of students": students.length, students});
})

// e) List the names of students who got more than 20 marks in DSBDASubject in browser.
app.get('/getmorethan20indsbda', async (req, res) => {
    const students = await StudentMarks.find({DSBDA_Marks: {$gt: 20}}, {Name: 1});

    res.send({"Students who got more than 20 marks in DSBDA": students.length, students});
})

// f) Update the marks of Specified students by 10.
app.put('/updateby10/:studentId', async (req, res) => {

    const studentId = req.params.studentId;
    const student = await StudentMarks.findByIdAndUpdate({_id: studentId}, {$inc: {WAD_Marks: 10, CC_Marks: 10,  DSBDA_Marks: 10, CNS_Marks: 10, AI_Marks: 10}}, {new: True});
    res.send({"student": student});
})

// g) List the names who got more than 25 marks in all subjects inbrowser.
app.get('/morethan25', async (req, res) => {
    const students = await StudentMarks.find({
        WAD_Marks: {$gt: 25},
        CC_Marks: {$gt: 25},
        DSBDA_Marks: {$gt: 25},
        CNS_Marks: {$gt: 25},
        AI_Marks: {$gt: 25},
    }, 
    {Name: 1});

    res.send({"students": students});

})

// h) List the names who got less than 40 in both Maths and Science inbrowser.
app.get('/lessThan40InAIAndCC', async (req, res) => {
    const students = await StudentMarks.find({
        CC_Marks: {$lt: 40},
        AI_Marks: {$lt: 40},
    },
    {Name: 1});

    res.send({"students": students});
})

// i) Remove specified student document from collection.
app.delete('/delete/:studentId', async (req, res) => {
    const studentId = req.params.studentId;
    const student = await StudentMarks.findOneAndDelete({_id: studentId});
    res.send({"message": "Student deleted successfully", student});
})

// j) Display the Students data in Browser in tabular format.

app.get('/displayAllStudentsInTable', async (req, res) => {
    const students = await StudentMarks.find();
    let html = "<table border=1 style='border-collapse: collapse;'>";

    html = html + `
        <thead>
            <tr>
                <th>Name</th>
                <th>Roll No</th>
                <th>WAD Marks</th>
                <th>CC Marks</th>
                <th>DSBDA Marks</th>
                <th>CNS Marks</th>
                <th>AI Marks</th>
            </tr>
        </thead>
    `;

    html = html + "<tbody>";
    students.map((student) => {
        `<tr>
            <td>${student.Name}</td>
            <td>${student.Roll_No}</td>
            <td>${student.WAD_Marks}</td>
            <td>${student.CC_Marks}</td>
            <td>${student.DSBDA_Marks}</td>
            <td>${student.CNS_Marks}</td>
            <td>${student.AI_Marks}</td>
        </tr>`
    });

    html = html + "</tbody></table>";

    res.send(html);
})

mongoose.connect(db_string).then(() => {
    app.listen(PORT, function() {
        console.log("----------------Database connection successfull and server is started------------------------------------");
        console.log("http://localhost:"+ PORT);
    })
}).catch((error) => {
    console.log("Problem to connect with database");
    console.log(error)
})