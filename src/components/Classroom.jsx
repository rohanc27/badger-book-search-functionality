import { useEffect, useState } from "react";
import { Button, Container, Form, Row, Col } from "react-bootstrap";
import Student from "./Student";
import { Pagination } from "react-bootstrap";

const Classroom = () => {

    const [students, setStudents] = useState([]);
    const [searchName, setSearchName] = useState("");
    const [searchMajor, setSearchMajor] = useState("");
    const [searchInterest, setSearchInterest] = useState("");
    const [page, setPage] = useState(1);

    useEffect(() => {
        fetch("https://cs571api.cs.wisc.edu/rest/s26/hw4/students", {
            headers: {
                "X-CS571-ID": "bid_22787f8486626989742479e554bf4deacd50f0d91ec0b765e74001aa5b78f107"
            }
        })
        .then(res => res.json())
        .then(data => {
            console.log(data);
            setStudents(data);
        });
    }, []);

    useEffect(() => {
        setPage(1);
    }, [searchName, searchMajor, searchInterest]);

    const filteredStudents = students.filter(s => {

        const nameQuery = searchName.trim().toLowerCase();
        const majorQuery = searchMajor.trim().toLowerCase();
        const interestQuery = searchInterest.trim().toLowerCase();

        const fullName = (s.name.first + " " + s.name.last).toLowerCase();

        const matchesName =
            !nameQuery || fullName.includes(nameQuery);

        const matchesMajor =
            !majorQuery || s.major.toLowerCase().includes(majorQuery);

        const matchesInterest =
            !interestQuery ||
            s.interests.some(i =>
                i.toLowerCase().includes(interestQuery)
            );

        return matchesName && matchesMajor && matchesInterest;
    });

    const studentsPerPage = 24;
    const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);
    const startIndex = (page - 1) * studentsPerPage;
    const endIndex = startIndex + studentsPerPage;
    const studentsOnPage = filteredStudents.slice(startIndex, endIndex);

    const handleReset = () => {
    setSearchName("");
    setSearchMajor("");
    setSearchInterest("");
    };

    return <div>
        <h1>Badger Book</h1>
        <p>Search for students below!</p>
        <hr />
        <Form>
            <Form.Label htmlFor="searchName">Name</Form.Label>
            <Form.Control
                id="searchName"
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
            />
            <Form.Label htmlFor="searchMajor">Major</Form.Label>
            <Form.Control
                id="searchMajor"
                value={searchMajor}
                onChange={(e) => setSearchMajor(e.target.value)}
            />
            <Form.Label htmlFor="searchInterest">Interest</Form.Label>
            <Form.Control
                id="searchInterest"
                value={searchInterest}
                onChange={(e) => setSearchInterest(e.target.value)}
            />
            <br />
            <Button variant="secondary" onClick={handleReset}>Reset Search</Button>
        </Form>

        <p id="num-results">
            There are {filteredStudents.length} student(s) matching your search.
        </p>
        <Container fluid>
            <Row id='students'>
                {studentsOnPage.map(s => (
                    <Col key={s.id} xs={12} md={6} lg={4} xl={3} className="mb-3">
                        <Student {...s} />
                    </Col>
                ))}
            </Row>
        </Container>
        <Pagination className="justify-content-center mt-4">

            <Pagination.Prev
                disabled={page === 1 || totalPages === 0}
                onClick={() => setPage(page - 1)}
            />

            {Array.from({ length: totalPages }, (_, i) => (
                <Pagination.Item
                    key={i + 1}
                    active={page === i + 1}
                    onClick={() => setPage(i + 1)}
                >
                    {i + 1}
                </Pagination.Item>
            ))}
            
            <Pagination.Next
                disabled={page === totalPages || totalPages === 0}
                onClick={() => setPage(page + 1)}
            />
        </Pagination>
    </div>

}

export default Classroom;