import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import AudioService from '/imports/ui/components/audio/service';
import BreakoutComponent from './component';
import Service from './service';

const BreakoutContainer = props => <BreakoutComponent {...props} />;


export default withTracker((props) => {
  const {
    endAllBreakouts,
    requestJoinURL,
    findBreakouts,
    breakoutRoomUser,
    transferUserToMeeting,
    transferToBreakout,
    meetingId,
    amIModerator,
    closeBreakoutPanel,
    getNumUsersByBreakoutId,
  } = Service;
  const breakoutRooms = findBreakouts();
  const isMicrophoneUser = AudioService.isConnected() && !AudioService.isListenOnly();
  const isMeteorConnected = Meteor.status().connected;

  return {
    ...props,
    breakoutRooms,
    endAllBreakouts,
    requestJoinURL,
    breakoutRoomUser,
    transferUserToMeeting,
    transferToBreakout,
    isMicrophoneUser,
    meetingId: meetingId(),
    amIModerator: amIModerator(),
    closeBreakoutPanel,
    getNumUsersByBreakoutId,
    isMeteorConnected,
  };
})(BreakoutContainer);
