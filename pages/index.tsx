import React, { useState, useEffect } from "react";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import { Button, Grid, Input, TextField, Paper } from "@material-ui/core";
import moment from "moment";
import { axiosInstance } from "../services/network_request";
import { IndexStyles } from "../styles/styles";

interface IEvents {
  eventName: string;
  time: Date | string;
  id: string;
}

export default function Index() {
  /**
   * our style class
   */
  // const classes = IndexStyles()
  /**
   * our states go here
   */
  const [enteredInterval, setEnteredInterval] = useState<string>("");
  const [timeInterval, setTimeInterval] = useState<number>(0);
  const [enteredEvent, setEnteredEvent] = useState<string>("");
  const [lastPostTimePast, setLastPostTimePast] = useState<string>("");

  const [events, setEvents] = useState<IEvents[]>([]);

  useEffect(() => {
    setInterval(() => {
      let time = getLastPostAge();
      setLastPostTimePast(time);
    }, 1000);
  }, []);

  /**
   * helper functions
   */
  async function postEventHandler() {
    try {
      const data = await (
        await axiosInstance.post("/event/createevent", { name: enteredEvent })
      ).data;
      setEvents([
        ...events,
        { eventName: data.event, time: data.createdAt, id: data._id },
      ]);
      setEnteredEvent("");
    } catch (error) {
      console.log(error);
    }
  }
  async function deleteEvent(id) {
    try {
      const deleted = await (
        await axiosInstance.post(`/event/deleteevent/${id}`)
      ).data;
      const filteredEvents = events.filter((x) => x.id !== id);
      setEvents(filteredEvents);
    } catch (error) {
      console.log(error);
    }
  }
  function getLastPostAge() {
    if (events.length > 0) {
      const lastEvent = events[events.length - 1];
      const lastEventTimeStamp = moment(lastEvent.time);
      const rightNow = moment(new Date());
      const seconds = rightNow.diff(lastEventTimeStamp, "seconds");
      const minutes = rightNow.diff(lastEventTimeStamp, "minutes");
      if (minutes >= 1) {
        return minutes + " Minutes";
      } else {
        return seconds + " Seconds";
      }
    }
  }
  function getEventAge(eventDate: Date | string) {
    const eventDateMo = moment(eventDate);
    const rightNowMo = moment(new Date());
    const difference = rightNowMo.diff(eventDateMo, "seconds");
    if (difference <= timeInterval) {
      return false;
    } else {
      return true;
    }
  }
  async function setIntervalHandler() {
    if (enteredInterval !== "") {
      try {
        const data = await (
          await axiosInstance.post("/interval/createinterval", {
            interval: parseInt(enteredInterval),
          })
        ).data;
        setTimeInterval(parseInt(enteredInterval));
        setEnteredInterval("");
      } catch (e) {
        console.log(e);
      }
    }
  }
  return (
    <Container style={{ marginTop: "4em" }}>
      <Grid container direction="column">
        <Grid item>
          <TextField
            id="outlined-search"
            label="Enter Event"
            variant="outlined"
            value={enteredEvent}
            onChange={(e) => setEnteredEvent(e.target.value)}
          />
          <Button
            style={{
              marginLeft: "2em",
              backgroundColor: "green",
              color: "white",
              marginTop: "0.5em",
            }}
            onClick={postEventHandler}
          >
            Post Event{" "}
          </Button>
        </Grid>
        {/* 
         todo make sure you remove the arrows from number and validate against negative numbers
        */}
        <Grid item style={{ marginTop: "4em" }}>
          <TextField
            id="outlined-search"
            label="Enter Interval"
            variant="outlined"
            type="number"
            value={enteredInterval}
            onChange={(e) => setEnteredInterval(e.target.value)}
          />
          <Button
            style={{
              marginLeft: "2em",
              backgroundColor: "green",
              color: "white",
              marginTop: "0.5em",
            }}
            onClick={setIntervalHandler}
          >
            Post Interval{" "}
          </Button>
        </Grid>
        <Typography style={{ marginTop: "2em" }}>
          Time interval : {timeInterval}
        </Typography>
        <Typography style={{ marginTop: "2em", marginBottom: "2em" }}>
          {" "}
          <React.Fragment>
            {events.length > 0
              ? `it has been ${getLastPostAge()} since your last posting`
              : `you have not posted any event`}
          </React.Fragment>
        </Typography>

        {events.map((event) => (
          <Paper elevation={3} style={{ padding: "1em", marginBottom: "1em" }}>
            <Grid direction="row" container>
              <Typography
                key={event.id}
                style={{ color: getEventAge(event.time) ? "red" : "blue" }}
              >
                {event.eventName} , {moment(event.time).format("ddd")}{" "}
                {moment(event.time).format("MMM-DD-YYYY")}
              </Typography>
              <Button
                style={{
                  marginLeft: "auto",
                  backgroundColor: "red",
                  color: "white",
                }}
                onClick={async () => await deleteEvent(event.id)}
              >
                Delete
              </Button>
            </Grid>
          </Paper>
        ))}
      </Grid>
    </Container>
  );
}
