import { useState, useEffect, useRef } from "react";
import { Button, Col, Input, Modal, Row, Typography } from "antd";
import "../../index.css";
import validateResponse from "../../Components/validateResponse";
import { imsAxios } from "../../axiosInterceptor";

function OtpVerify({ showOTPVerifyModal, setShowOTPVerifyModal }) {
  const [currentFocus, setCurrentFocus] = useState(1);
  const [timer, setTimer] = useState(30);
  const [numberCompleted, setNumberCompleted] = useState(false);
  const [OTPSent, setOTPSent] = useState(false);
  const [userNumber, setUserNumber] = useState("");
  const submitRef = useRef();
  const refs = {
    ref1: useRef(),
    ref2: useRef(),
    ref3: useRef(),
    ref4: useRef(),
    ref5: useRef(),
    ref6: useRef(),
    ref7: useRef(),
    ref8: useRef(),
  };
  const mobileRefs = {
    ref2: useRef(),
    ref5: useRef(),
    ref6: useRef(),
    ref7: useRef(),
    ref8: useRef(),
  };
  const inputHandler = (value, current, event, mobile) => {
    if (!mobile) {
      if (value.length == 1) {
        let num = current;
        let val = "ref" + num;
        for (const property in refs) {
          if (property == val) console.log(refs[val].current.value == value);
        }
      }
      if (value.length >= 1) {
        let num = current + 1;
        let val = "ref" + num;
        for (const property in refs) {
          if (property == val) console.log(refs[val].current.focus());
        }
        if (current == 8) {
          submitRef.current.focus();
        }
      }
      if (event.key === "Backspace" && current > 1) {
        console.log(current);
        let num = current - 1;
        let val = "ref" + num;
        for (const property in refs) {
          if (property == val) refs[val].current.focus();
        }
      }
      if (event.key === "Backspace" && current == 1) {
        console.log(current);
        let num = current;
        let val = "ref" + num;
        for (const property in refs) {
          if (property == val) refs[val].current.focus();
        }
      }
    } else {
      if (value.length == 1) {
        let num = current;
        let val = "ref" + num;
      }
      if (value.length >= 1) {
        let add = 0;
        console.log(current);
        if (+current.split(["ref"])[1] == 2) {
          add = 3;
        } else if (
          +current.split(["ref"])[1] == 5 ||
          +current.split(["ref"])[1] == 6 ||
          +current.split(["ref"])[1] == 7
        ) {
          add = 1;
        }
        let num = +current.split(["ref"])[1] + add;
        let val = "ref" + num;
        // console.log(refval);
        for (const property in mobileRefs) {
          if (property == val) mobileRefs[val].current.focus();
        }
        if (current == 8) {
          submitRef.current.focus();
        }
      }
      if (event.key === "Backspace" && +current.split(["ref"])[1] > 1) {
        let add = 0;
        if (+current.split(["ref"])[1] == 5) {
          add = 3;
        } else if (
          +current.split(["ref"])[1] == 6 ||
          +current.split(["ref"])[1] == 7 ||
          +current.split(["ref"])[1] == 8
        ) {
          add = 1;
        }
        let num = +current.split(["ref"])[1] - add;
        let val = "ref" + num;
        for (const property in mobileRefs) {
          if (property == val) mobileRefs[val].current.focus();
        }
      }
      if (event.key === "Backspace" && current == 1) {
        console.log(current);
        let num = current;
        let val = "ref" + num;
        for (const property in mobileRefs) {
          if (property == val) mobileRefs[val].current.focus();
        }
      }
    }
    let arr = [];
    for (const property in mobileRefs) {
      arr.push(mobileRefs[property].current.value);
    }
    arr.map((row) => {
      if (row == "") {
        setNumberCompleted(false);
      } else {
        setNumberCompleted(true);
      }
    });
  };
  const sendOTP = async () => {
    if (numberCompleted) {
      let arr = [];
      for (const property in mobileRefs) {
        arr.push(mobileRefs[property].current.value);
      }
      const { data } = await imsAxios.post("/profile/getMobileOTP", {
        mobile: arr.toString().replaceAll(",", ""),
      });
    }
  };
  const checkMobile = async () => {
    const { data } = await imsAxios.get("/profile/checkMobile");
    validateResponse(data);
    setUserNumber(
      `${data.data.mobile[0]}*${data.data.mobile[1]}${data.data.mobile[2]}****${data.data.mobile[3]}${data.data.mobile[4]}`
    );
    return data.code;
  };
  const generateOTP = async () => {
    // const mobile = await checkMobile();
    // let arr = [];
    // for (const property in mobileRefs) {
    //   arr.push(mobileRefs[property].current.value);
    // }
    // if (mobile == 200) {
    //   const { data } = await imsAxios.post("/profile/getMobileOTP", {
    //     mobile: arr,
    //   });
    //   validateResponse(data);
    //   if (data.code == 200) {
    //     setOTPSent(true);
    //   }
    // }
  };
  const inputBox = (current, ref) => {
    console.log(mobileRefs[current]);
    return (
      <input
        placeholder="*"
        className="otp-input"
        onKeyUp={(e) => inputHandler(e.target.value, current, e, "mobile")}
        ref={mobileRefs[current]}
      />
    );
  };
  const returnPartialNumber = () => {
    let comp;
    // for (let i = 0; i < userNumber.length; i++) {
    //   if (userNumber[i] === "*") {
    //     let num = i + 1;
    //     comp = [inputBox("ref" + num)];
    //   } else {
    //     return userNumber[i];
    //   }
    // }
  };
  useEffect(() => {
    generateOTP();
    // timer from here
    // const timeOut = setInterval(() => {
    //   setTimer((timer) => timer > 0 && timer - 1);
    // }, 1000);
    // setTimeout(() => {
    //   clearTimeout(timeOut);
    // }, 30000);
    if (showOTPVerifyModal) {
      checkMobile();
    }
  }, [showOTPVerifyModal]);

  // useEffect(() => {
  //   if(timer == 0){
  //   }
  // },[timer])
  return (
    <Modal
      title="Verify OTP"
      open={showOTPVerifyModal}
      onCancel={() => setShowOTPVerifyModal(false)}
      footer={[
        <Button
          disabled={timer > 0}
          key="back"
          onClick={() => setShowOTPVerifyModal(false)}
        >
          Resend OTP: {timer}
        </Button>,
        <Button
          onClick={() => {
            if (!OTPSent) {
              sendOTP();
            }
          }}
          ref={submitRef}
          key="submit"
          type="primary"
        >
          Get OTP
        </Button>,
      ]}
    >
      {!OTPSent && (
        <Row gutter={6} justify="center">
          {[...userNumber].map((char, index) => {
            if (char === "*") {
              let num = index + 1;
              return <Col>{inputBox("ref" + num)}</Col>;
            } else {
              // console.log(char);
              return (
                <Col>
                  <Typography.Text>{char}</Typography.Text>
                </Col>
              );
            }
          })}
        </Row>
      )}
      {OTPSent && (
        <>
          <Row justify="center" style={{ marginBottom: 15 }}>
            <Typography.Text>OTP sent to Mpbile {userNumber}</Typography.Text>
          </Row>
          <Row justify="center" gutter={4}>
            <Col>
              <input
                placeholder="*"
                className="otp-input"
                onKeyDown={(e) => inputHandler(e.target.value, 1, e)}
                ref={refs.ref1}
              />
            </Col>
            <Col>
              <input
                placeholder="*"
                className="otp-input"
                onKeyUp={(e) => inputHandler(e.target.value, 2, e)}
                ref={refs.ref2}
              />
            </Col>
            <Col>
              <input
                placeholder="*"
                className="otp-input"
                onKeyUp={(e) => inputHandler(e.target.value, 3, e)}
                ref={refs.ref3}
              />
            </Col>
            <Col>
              <input
                placeholder="*"
                className="otp-input"
                onKeyUp={(e) => inputHandler(e.target.value, 4, e)}
                ref={refs.ref4}
              />
            </Col>
            <Col>
              <input
                placeholder="*"
                className="otp-input"
                onKeyUp={(e) => inputHandler(e.target.value, 5, e)}
                ref={refs.ref5}
              />
            </Col>
            <Col>
              <input
                placeholder="*"
                className="otp-input"
                onKeyUp={(e) => inputHandler(e.target.value, 6, e)}
                ref={refs.ref6}
              />
            </Col>
            <Col>
              <input
                placeholder="*"
                className="otp-input"
                onKeyUp={(e) => inputHandler(e.target.value, 7, e)}
                ref={refs.ref7}
              />
            </Col>
            <Col>
              <input
                placeholder="*"
                className="otp-input"
                onKeyUp={(e) => inputHandler(e.target.value, 8, e)}
                ref={refs.ref8}
              />
            </Col>
          </Row>
        </>
      )}
    </Modal>
  );
}

export default OtpVerify;
