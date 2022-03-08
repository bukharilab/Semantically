import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Modal, Input, Col, Row, Container } from "react-bootstrap";
import $ from "jquery";
import { recommendationFlag } from "../hooks/editor/documentAPI";

export default function PopupRecommendation(props) {
  let {
    terminology,
    reply_content,
    post_reply_id,
    ontology_link,
    flag_1,
    flag_2,
    show,
    onHide,
    confidence_score,
  } = props;

  const [message, setmessage] = useState(null);
  //const [show, setShow] = useState(true);
  const [timeoutId, updateTimeoutId] = useState(0);
  const [flag, setFlag] = useState("");
  //console.log("show is", show);
  const handleClose = () => onHide(false);
  // const handleClose = () => {
  //   //setShow(false);
  // };
  //const handleShow = () => setShow(true);
  const acceptRecommendation = () => {
    setFlag([]);
    clearTimeout(timeoutId);
    updateTimeoutId(
      setTimeout(() => recommendationFlag(post_reply_id, flag_1, setFlag), 1000)
    );
    handleClose();
  };

  const rejectRecommendation = () => {
    setFlag([]);
    clearTimeout(timeoutId);
    updateTimeoutId(
      setTimeout(() => recommendationFlag(post_reply_id, flag_2, setFlag), 1000)
    );

    handleClose();
    //alert("rejected");
  };

  return (
    <>
      <div className="container ">
        {/* <!--- Model Box ---> */}

        <div className="model_box">
          <Modal
            show={show}
            //onHide={handleClose}
            backdrop="static"
            keyboard={false}
          >
            <Modal.Header closeButton onHide={onHide}>
              <Modal.Title>Recommendation</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {/* <form> */}
              <div className="form-group border border-light">
                {/* <p style={{ fontWeight: "bold", color: "red" }}>Terminology</p> */}
                <tr>
                  <td
                    style={{
                      fontWeight: "bold",
                      color: "green",
                      fontSize: 20,
                    }}
                  >
                    Terminology:
                  </td>
                  <td
                    style={{
                      fontWeight: "bold",
                      color: "black",
                      fontSize: 20,
                    }}
                  >
                    {terminology}
                  </td>
                </tr>
              </div>

              <div className="form-group border border-light  ">
                {/* <p style={{ fontWeight: "bold", color: "red" }}>Terminology</p> */}
                <tr>
                  <td
                    style={{
                      fontWeight: "bold",
                      color: "green",
                      fontSize: 20,
                    }}
                  >
                    Expert Confidence Level:
                  </td>
                  <td
                    style={{
                      fontWeight: "bold",
                      color: "black",
                      fontSize: 20,
                    }}
                  >
                    {confidence_score}%
                  </td>
                </tr>
              </div>

              <div className="form-group mt-3 border border-light">
                <tr>
                  <td
                    style={{
                      fontWeight: "bold",
                      color: "green",
                      fontSize: 20,
                    }}
                  >
                    Expert Reply:
                  </td>
                </tr>
                <tr>
                  <td>{reply_content}</td>
                </tr>
              </div>

              <div className="form-group mt-3 border border-light">
                <tr>
                  <td
                    style={{
                      fontWeight: "bold",
                      color: "green",
                      fontSize: 20,
                    }}
                  >
                    Ontology Link:
                  </td>
                </tr>
                <tr>
                  <td>{ontology_link}</td>
                </tr>
              </div>
            </Modal.Body>

            <Modal.Footer>
              <Button variant="success" onClick={acceptRecommendation}>
                Accept
              </Button>
              <Button variant="secondary" onClick={rejectRecommendation}>
                Reject
              </Button>
            </Modal.Footer>
          </Modal>

          {/* Model Box Finsihs */}
        </div>
      </div>
    </>
  );
}

// const LookUp = ({
//   word,
//   ontology,
//   updateOpenPostModal,
//   updateOpenLookUpModal,
// }) => {
//   const closeModal = () => updateOpenLookUpModal(false);
//   const askQuestion = () => {
//     closeModal();
//     updateOpenPostModal(true);
//   };

//   return (
//     <Modal
//       show={true}
//       size="md"
//       aria-labelledby="contained-modal-title-vcenter"
//       centered
//     >
//       <Modal.Header closeButton onHide={closeModal}>
//         <Modal.Title id="contained-modal-title-vcenter">{word}</Modal.Title>
//       </Modal.Header>
//       <Modal.Body>
//         <Accordion defaultActiveKey={`${word}-modal-0`} id="sidebar-accordion">
//           <FormControl
//             type="search"
//             placeholder="Search"
//             className="mr-2 mb-3"
//             aria-label="Search"
//           />
//           <Card>
//             <Accordion.Toggle
//               as={Card.Header}
//               eventKey={`${word}-modal-0`}
//               className={`d-flex justify-content-between modal-toggle-`}
//             >
//               <span>{"NCIT"}</span>
//               <div>
//                 <Button variant="outline-primary" size="sm" onClick={() => {}}>
//                   select
//                 </Button>{" "}
//                 <Button variant="outline-info" size="sm" onClick={() => {}}>
//                   open
//                 </Button>
//               </div>
//             </Accordion.Toggle>
//             <Accordion.Collapse
//               eventKey={`${word}-modal-0`}
//               className={`p-2 p-0 accordion-card`}
//             >
//               <Card>
//                 <Card.Body>
//                   <Card.Text>
//                     {
//                       "Omnis nihil blanditiis autem numquam autem sit. Quia earum rerum id at. Omnis tempora ea vitae ut corrupti sequi ut. Dignissimos accusamus et in. Nemo perferendis quam quis aut qui consequatur amet. Autem adipisci laboriosam totam et."
//                     }
//                   </Card.Text>
//                 </Card.Body>
//               </Card>
//             </Accordion.Collapse>
//           </Card>
//           <Card>
//             <Accordion.Toggle
//               as={Card.Header}
//               eventKey={`${word}-modal-1`}
//               className={`d-flex justify-content-between modal-toggle-`}
//             >
//               <span>{"OMIT"}</span>
//               <div>
//                 <Button variant="outline-primary" size="sm" onClick={() => {}}>
//                   select
//                 </Button>{" "}
//                 <Button variant="outline-info" size="sm" onClick={() => {}}>
//                   open
//                 </Button>
//               </div>
//             </Accordion.Toggle>
//             <Accordion.Collapse
//               eventKey={`${word}-modal-1`}
//               className={`p-2 p-0 accordion-card`}
//             >
//               <Card>
//                 <Card.Body>
//                   <Card.Text>
//                     {
//                       "Omnis nihil blanditiis autem numquam autem sit. Quia earum rerum id at. Omnis tempora ea vitae ut corrupti sequi ut. Dignissimos accusamus et in. Nemo perferendis quam quis aut qui consequatur amet. Autem adipisci laboriosam totam et."
//                     }
//                   </Card.Text>
//                 </Card.Body>
//               </Card>
//             </Accordion.Collapse>
//           </Card>
//           <Card>
//             <Accordion.Toggle
//               as={Card.Header}
//               eventKey={`${word}-modal-2`}
//               className={`d-flex justify-content-between modal-toggle-`}
//             >
//               <span>{"MELO"}</span>
//               <div>
//                 <Button variant="outline-primary" size="sm" onClick={() => {}}>
//                   select
//                 </Button>{" "}
//                 <Button variant="outline-info" size="sm" onClick={() => {}}>
//                   open
//                 </Button>
//               </div>
//             </Accordion.Toggle>
//             <Accordion.Collapse
//               eventKey={`${word}-modal-2`}
//               className={`p-2 p-0 accordion-card`}
//             >
//               <Card>
//                 <Card.Body>
//                   <Card.Text>
//                     {
//                       "Omnis nihil blanditiis autem numquam autem sit. Quia earum rerum id at. Omnis tempora ea vitae ut corrupti sequi ut. Dignissimos accusamus et in. Nemo perferendis quam quis aut qui consequatur amet. Autem adipisci laboriosam totam et."
//                     }
//                   </Card.Text>
//                 </Card.Body>
//               </Card>
//             </Accordion.Collapse>
//           </Card>
//         </Accordion>
//         {/* <div className="text-right"><Button variant="link" style={{'box-shadow': 'none'}} onClick={() => askQuestion()}>{'Ask question'}</Button></div> */}
//       </Modal.Body>
//       <Modal.Footer>
//         <Button onClick={closeModal}>Close</Button>
//       </Modal.Footer>
//     </Modal>
//   );
// };
