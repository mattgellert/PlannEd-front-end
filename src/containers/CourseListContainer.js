import React, { Component } from 'react';
import { Redirect } from 'react-router';
import { connect } from 'react-redux';
import DashboardCalendar from '../components/DashboardCalendar';
import AssignmentContainer from './AssignmentContainer';
import AssignmentSearchForm from '../components/AssignmentSearchForm';
import MainNavBar from '../components/MainNavBar';
import NavBar from '../components/NavBar';
import { dateChange, eventDelete, eventCancelDelete, eventDeleteWarning, updateEventDetails, editSelectedEvent, deselectEvent, selectEvent, seeToDos, descChange, deselectForToDo, calendarClick, titleChange, selectSlot, submitCourseToDo, startChange, endChange } from '../actions/students'; ///KEEP
import ToDoForm from '../components/ToDoForm';
import './DashboardContainer.css';
import CourseContainer from './CourseContainer';
import EventDetailsWindow from '../components/EventDetailsWindow';
import EventDetailsForm from '../components/EventDetailsForm';
import DirectoryContainer from './DirectoryContainer';


class CourseListContainer extends Component {

  constructor(props) {
    super(props);

    this.state = { showDirectoryContainer: false };
  }

  toggleDirectoryContainer = () => {
    this.setState({ showDirectoryContainer: !this.state.showDirectoryContainer });
  }

  slotSelected = (slotInfo) => {
    console.log("cal slot selected:",slotInfo)
    this.props.onSelectSlot(slotInfo)
  }

  handleSubmit = (event) => {
    console.log('event create')
    event.preventDefault();
    const selectedSlot = this.props.selectedSlot;
    const toDoTime = `${this.props.selectedSlot.startTime}:${this.props.selectedSlot.endTime}`;
    this.props.selectedAssignment.showDetails === this.props.selectedForToDo ? null : this.props.onSeeToDos(this.props.seeToDoFor);
    const dateToSubmit = selectedSlot.info.start.toLocaleDateString();
    this.props.onSubmitCourseToDo(dateToSubmit, toDoTime, this.props.selectedForToDo, selectedSlot.title, selectedSlot.description);
  };

  handleStartChange = (event) => {
    this.props.onStartChange(event.target.value);
  }

  handleEndChange = (event) => {
    this.props.onEndChange(event.target.value);
  }

  handleTitleChange = (event) => {
    this.props.onTitleChange(event.target.value);
  };

  handleCloseForm = (event) => {
    this.props.onDeselectForToDo();
  };

  handleDescChange = (event) => {
    this.props.onDescChange(event.target.value)
  };

  handleDateChange = (event) => {
    this.props.onDateChange(event.target.value);
  }


  //////ADDED////

  handleSelectEvent = (event) => {

    this.props.onSelectEvent(event)
    this.windowListener = document.body.addEventListener("click", (event) => {
      console.log("event selected", event)
      event.target.id !== "event-details-window" ? this.handleCloseEventWindow() : null;
    });
  }

  handleCloseEventWindow = () => {
    this.props.onDeselectEvent();
    this.windowListener = null;
  };

  handleEventDeleteWarning = () => {
    this.props.onEventDeleteWarning();
  };

  handleEventDelete = () => {
    this.props.onEventDelete(this.props.eventSelected.data.id);
  };

  handleEventCancelDelete = () => {
    this.props.onEventCancelDelete();
  };

  handleEventDetailsUpdate = (event) => {
    console.log('event updated description:', this.props.selectedSlot)
    event.preventDefault();
    const eventSelected = this.props.eventSelected.data;
    const updatedEventStart = typeof this.props.selectedSlot.startTime === "string" ? this.props.selectedSlot.startTime : this.props.selectedSlot.startTime.toTimeString().slice(0,5);
    const updatedEventEnd = typeof this.props.selectedSlot.endTime === "string" ? this.props.selectedSlot.endTime : this.props.selectedSlot.endTime.toTimeString().slice(0,5);
    const updatedEventTime = `${updatedEventStart}:${updatedEventEnd}`;
    this.props.onDeselectEvent();
    this.windowListener = null;
    const updatedEventDate = this.props.selectedSlot.date;
    debugger
    this.props.onUpdateEventDetails(updatedEventDate, updatedEventTime, eventSelected.id, this.props.selectedSlot.title, this.props.selectedSlot.description, eventSelected.eventType);
  };

  handleShowEventForm = () => {
    this.props.onEditSelectedEvent();
  };

  //////ADDED////

  render() {

    // const calProps = {slotSelected: this.slotSelected, setStartTime: this.setStartTime, setEndTime: this.setEndTime }
    let MainNavChildren;
     // if (this.props.student.id) {
     //   MainNavChildren = (
     //     <AssignmentSearchForm courses={this.props.studentCourses} assignments={this.props.studentAssignments}/>
     //   );
     // }
     if (this.state.showDirectoryContainer) {
       return <DirectoryContainer history={this.props.history} toggleDirectoryContainer={this.toggleDirectoryContainer} />;
     }


    return (
      <div className="home-wrapper">
        <MainNavBar children={MainNavChildren}/>
          {(this.props.selectedForToDo !== 0) && !!this.props.selectedSlot.info
            ?
              <div className="to-do-form-assignment-container" >
                <ToDoForm calendarClick={this.props.calendarClick} handleSubmit={this.handleSubmit} selectedSlot={this.props.selectedSlot} handleTitleChange={this.handleTitleChange} handleStartChange={this.handleStartChange} handleEndChange={this.handleEndChange} handleCloseForm={this.handleCloseForm} handleDescChange={this.handleDescChange}/>
              </div>
            : null
          }
          {!!this.props.eventSelected.data
            ?
              <div>
                {this.props.eventSelected.edit
                  ?
                    <EventDetailsForm onDateChange={this.handleDateChange} toDelete={this.props.eventSelected.toDelete} handleEventDeleteWarning={this.handleEventDeleteWarning} handleEventDelete={this.handleEventDelete} handleEventCancelDelete={this.handleEventCancelDelete} handleTitleChange={this.handleTitleChange} handleStartChange={this.handleStartChange} handleEndChange={this.handleEndChange} handleDescChange={this.handleDescChange} selectedSlot={this.props.selectedSlot} calendarClick={this.props.calendarClick} eventInfo={this.props.eventSelected.data} handleCloseEventWindow={this.handleCloseEventWindow} handleEventDetailsUpdate={this.handleEventDetailsUpdate}/>
                  :
                    <EventDetailsWindow calendarClick={this.props.calendarClick} eventInfo={this.props.eventSelected.data} handleShowEventForm={this.handleShowEventForm} handleCloseEventWindow={this.handleCloseEventWindow}/>
                }
              </div>
            : null
          }
          <div className="content-wrapper">
            <NavBar {...this.props} activeTab="directory" />
            <div className="content-container">
        {this.props.student.id ? <CourseContainer history={this.props.history} toggleDirectoryContainer={this.toggleDirectoryContainer}/> : <Redirect to="/"/>}
        {this.props.student.id
          ?
            <div className="dashboard-calendar-wrapper main-content">
              <DashboardCalendar slotSelected={this.slotSelected} handleSelectEvent={this.handleSelectEvent} inMyCourses={true} selectedStudentCourse={this.props.selectedStudentCourse} selectedAssignment={this.props.selectedAssignment}completedFilter={this.props.completedFilter} defaultDate={this.props.defaultDate} onCalendarClick={this.props.onCalendarClick} calendar={this.props.calendar}/>
            </div>
          :
            <Redirect to="/"/>
        }
      </div>
      </div>
      </div>
    );
  };
};



function mapStateToProps(state) {

  return {
    student: state.student,
    calendar: state.calendar,
    addConflict: state.directory.addConflict,
    slotSelected: state.slotSelected,
    selectedSlot: state.selectedSlot,
    selectedForToDo: state.selectedForToDo,
    calendarClick: state.calendarClick,
    defaultDate: state.calendar.defaultDate,
    courseFilter: state.studentAssignments.courseFilter,
    completedFilter: state.studentAssignments.completedFilter,
    seeToDoFor: state.calendar.seeToDoFor,
    selectedAssignment: state.selectedAssignment,
    studentCourses: state.studentCourses,
    selectedStudentCourse: state.selectedStudentCourse,
    eventSelected: state.eventSelected
  }
};

function mapDispatchToProps(dispatch) {
  return {
    onSelectSlot: (slotInfo) => {
      dispatch(selectSlot(slotInfo));
    },
    onSubmitCourseToDo: (date, time, studentCourseId, title, description) => {
      dispatch(submitCourseToDo(date, time, studentCourseId, title, description));
    },
    onStartChange: (startTime) => {
      dispatch(startChange(startTime));
    },
    onEndChange: (endTime) => {
      dispatch(endChange(endTime));
    },
    onTitleChange: (title) => {
      dispatch(titleChange(title));
    },
    onCalendarClick: (xPos, yPos) => {
      dispatch(calendarClick(xPos, yPos));
    },
    onDeselectForToDo: () => {
      dispatch(deselectForToDo());
    },
    onDescChange: (description) => {
      dispatch(descChange(description));
    },
    onSeeToDos: (studentAssignmentId) => {
      dispatch(seeToDos(studentAssignmentId));
    },
    onSelectEvent: (event) => {
      dispatch(selectEvent(event));
    },
    onDeselectEvent: () => {
      dispatch(deselectEvent());
    },
    onEditSelectedEvent: () => {
      dispatch(editSelectedEvent());
    },
    onUpdateEventDetails: (date, time, id, title, description, eventType) => {
      dispatch(updateEventDetails(date, time, id, title, description, eventType));
    },
    onEventDelete: (id) => {
      dispatch(eventDelete(id));
    },
    onEventCancelDelete: () => {
      dispatch(eventCancelDelete());
    },
    onEventDeleteWarning: () => {
      dispatch(eventDeleteWarning());
    },
    onDateChange: (date) => {
      dispatch(dateChange(date));
    }
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(CourseListContainer);
