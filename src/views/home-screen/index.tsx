import styles from "./index.module.css";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import LinearProgress, {
  LinearProgressProps,
} from "@mui/material/LinearProgress";
import mpegts from "mpegts.js";
import { useEffect, useRef, useState } from "react";
import * as SpeechSDK from "microsoft-cognitiveservices-speech-sdk";

function pushToQueue(queue: string[], item: string) {
  if (queue.length >= 2) {
    queue.shift(); // 从队首移除一个元素
  }
  queue.push(item); // 从队尾添加元素
  return queue;
}

function extractLicensePlateAndWindowInfo(inputString: string) {
  // 查找 "请" 字和 "到" 字之间的文本，用于提取车牌
  const licensePlateMatch = inputString.match(/请(.*?)到/);
  const licensePlate = licensePlateMatch ? licensePlateMatch[1] : "";

  // 查找 "到" 字和 "号" 字之间的文本，用于提取窗口信息
  const windowInfoMatch = inputString.match(/到(.*?)号/);
  const windowInfo = windowInfoMatch ? windowInfoMatch[1] : "";

  return { licensePlate, windowInfo };
}

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#253346",
    color: theme.palette.common.white,
    border: "none",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    backgroundColor: "#000",
    color: theme.palette.common.white,
    borderBottom: "1px solid #191d26",
  },
  [`&:last-child ${tableCellClasses.body}`]: {
    borderBottom: "none",
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const rows = [
  {
    name: "粤B2272F",
    calories: 10,
    fat: "32",
  },
  {
    name: "粤B2272F",
    calories: 20,
    fat: "32",
  },
  {
    name: "粤B2272F",
    calories: 30,
    fat: "32",
  },
  {
    name: "粤B2272F",
    calories: 40,
    fat: "32",
  },
  {
    name: "粤B2272F",
    calories: 50,
    fat: "32",
  },
  {
    name: "粤B2272F",
    calories: 40,
    fat: "32",
  },
  {
    name: "粤B2272F",
    calories: 50,
    fat: "32",
  },
  {
    name: "粤B2272F",
    calories: 60,
    fat: "32",
  },
  {
    name: "粤B2272F",
    calories: 70,
    fat: "32",
  },
  {
    name: "粤B2272F",
    calories: 80,
    fat: "32",
  },
  {
    name: "粤B2272F",
    calories: 90,
    fat: "32",
  },
  {
    name: "粤B2272F",
    calories: 100,
    fat: "32",
  },
  {
    name: "粤B2272F",
    calories: 100,
    fat: "32",
  },
  {
    name: "粤B2272F",
    calories: 100,
    fat: "32",
  },
];

const waitingVehicles = [
  "粤DZELQH",
  "粤A12G7U",
  "粤A49HNB",
  "粤CTUHQO",
  "粤BIHIVR",
  "粤AJNJHS",
  "粤ELUI33",
  "粤AZTCRI",
  "粤B09F58",
  "粤E932QL",
  "粤EN8BVJ",
  "粤CNXE7G",
  "粤CQ4QT0",
  "粤D8VVQD",
  "粤AC97WE",
  "粤DOXGT2",
  "粤DTSRSR",
  "粤CJH542",
  "粤E19P90",
  "粤CWGGFN",
];

function LinearProgressWithLabel(
  props: LinearProgressProps & { value: number }
) {
  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Box sx={{ width: "100%", mr: 1 }}>
        <LinearProgress variant="determinate" {...props} />
      </Box>
      <Box sx={{ minWidth: 35 }}>
        <Typography variant="body2">{`${Math.round(props.value)}%`}</Typography>
      </Box>
    </Box>
  );
}

export const HomeSCreen = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const speekRef = useRef<boolean>(false);
  const [currentVehicle, setCurrentVehicle] = useState("");
  const [currentCallVehicles, setcurrentCallVehicles] = useState<string[]>([
    "请粤BIHIVR到2号窗口办理业务",
    "请粤AJNJHS到5号窗口办理业务",
  ]);

  console.log(currentCallVehicles, "currentCallVehicles????");

  useEffect(() => {
    if (videoRef.current) {
      const player = mpegts.createPlayer({
        type: "mse", // could also be mpegts, m2ts, flv
        isLive: true,
        url: "https://sf1-hscdn-tos.pstatp.com/obj/media-fe/xgplayer_doc_video/flv/xgplayer-demo-360p.flv",
      });
      player.attachMediaElement(videoRef.current);
      player.load();
      player.play();
    }
  }, []);

  useEffect(() => {
    if (!currentVehicle || speekRef.current) {
      return;
    }
    speekRef.current = true;
    const speechConfig = SpeechSDK.SpeechConfig.fromSubscription(
      "76cb06039d234e97aff4db8f369fdf85",
      "centralus"
    );
    speechConfig.speechSynthesisVoiceName =
      // "Microsoft Server Speech Text to Speech Voice (zh-CN-shaanxi, XiaoniNeural)";
      "zh-CN-YunyangNeural";
    const audioConfig = SpeechSDK.AudioConfig.fromDefaultSpeakerOutput();
    const synthesizer = new SpeechSDK.SpeechSynthesizer(
      speechConfig,
      audioConfig
    );

    const complete_cb = function (result: any) {
      console.log("complete_cb");
      if (result.reason === SpeechSDK.ResultReason.SynthesizingAudioCompleted) {
        console.log("synthesis finished", result);
        synthesizer.close();
      } else if (result.reason === SpeechSDK.ResultReason.Canceled) {
        console.log("synthesis failed. Error detail: " + result.errorDetails);
      }
      synthesizer.close();
      speekRef.current = false;
    };
    const err_cb = function (err: any) {
      console.log(err);
      speekRef.current = false;

      synthesizer.close();
    };
    const windowNum = Math.floor(Math.random() * 5) + 1;
    const text = `请${currentVehicle}到${windowNum}号窗口办理业务`;
    setcurrentCallVehicles([...pushToQueue(currentCallVehicles, text)]);

    function generateLicensePlateSSML(licensePlate: string, window: number) {
      let ssml = `<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="zh-CN-YunyangNeural" xmlns:mstts="http://www.w3.org/2001/mstts">`;
      ssml += `<voice name="zh-CN-YunyangNeural">请`;
      for (const char of licensePlate) {
        ssml += `
            ${char}<break time="450ms"/>`;
      }
      ssml += `到${window}号窗口办理业务</voice>`;
      ssml += `</speak>`;
      return ssml;
    }
    const ssml = generateLicensePlateSSML(currentVehicle, windowNum);
    synthesizer.speakSsmlAsync(ssml, complete_cb, err_cb);
  }, [currentCallVehicles, currentVehicle]);

  const handleCallVehicle = () => {
    setCurrentVehicle(waitingVehicles.shift() || "");
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>深圳市安车检测欢迎您</div>
      <div className={styles.content}>
        <div className={styles.left}>
          <TableContainer
            component={Paper}
            style={{
              boxShadow: "none",
            }}
          >
            <Table aria-label="customized table">
              <TableHead>
                <TableRow>
                  <StyledTableCell>车牌号码</StyledTableCell>
                  <StyledTableCell align="left">完成进度</StyledTableCell>
                  <StyledTableCell align="right">用时/分钟</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row, index) => (
                  <StyledTableRow key={index}>
                    <StyledTableCell component="th" scope="row">
                      {row.name}
                    </StyledTableCell>
                    <StyledTableCell align="left">
                      <Box sx={{ width: "100%" }}>
                        <LinearProgressWithLabel
                          value={row.calories}
                          style={{
                            height: 10,
                            borderRadius: 4,
                          }}
                        />
                      </Box>
                    </StyledTableCell>
                    <StyledTableCell align="right">{row.fat}</StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
        <div className={styles.right}>
          <div className={styles.currentCallHeader}>
            <VolumeUpIcon />
            <span onClick={handleCallVehicle}>当前呼叫</span>
          </div>
          <div className={styles.currentCallContent}>
            {currentCallVehicles.map((item) => (
              <div className={styles.callItem} key={item}>
                请
                <span className={styles.highlight}>
                  {extractLicensePlateAndWindowInfo(item).licensePlate}
                </span>
                到
                <span className={styles.highlight}>
                  {extractLicensePlateAndWindowInfo(item).windowInfo}号窗口
                </span>
                办理业务
              </div>
            ))}
          </div>
          <video
            className={styles.video}
            ref={videoRef}
            controls
            autoPlay
          ></video>
        </div>
      </div>
    </div>
  );
};
