import Presentations from '/imports/api/presentations';
import { isVideoBroadcasting } from '/imports/ui/components/screenshare/service';
import { getVideoUrl } from '/imports/ui/components/external-video-player/service';
import Auth from '/imports/ui/services/auth';
import Users from '/imports/api/users';
import Settings from '/imports/ui/services/settings';
import VideoService from '/imports/ui/components/video-provider/service';
import PollingService from '/imports/ui/components/polling/service';
import getFromUserSettings from '/imports/ui/services/users-settings';

const LAYOUT_CONFIG = Meteor.settings.public.layout;
const KURENTO_CONFIG = Meteor.settings.public.kurento;

const getPresentationInfo = () => {
  const currentPresentation = Presentations.findOne({
    current: true,
  });

  return {
    current_presentation: (currentPresentation != null),
  };
};

const isUserPresenter = () => Users.findOne({ userId: Auth.userID },
  { fields: { presenter: 1 } }).presenter;

function shouldShowWhiteboard() {
  return true;
}

function shouldShowScreenshare() {
  const { viewScreenshare } = Settings.dataSaving;
  const enableScreensharing = getFromUserSettings('enableScreensharing', KURENTO_CONFIG.enableScreensharing);
  return enableScreensharing && viewScreenshare && isVideoBroadcasting();
}

function shouldShowExternalVideo() {
  const { enabled: enableExternalVideo } = Meteor.settings.public.externalVideoPlayer;
  return enableExternalVideo && getVideoUrl();
}

function shouldShowOverlay() {
  return getFromUserSettings('enableVideo', KURENTO_CONFIG.enableVideo);
}

const swapLayout = {
  value: getFromUserSettings('autoSwapLayout', LAYOUT_CONFIG.autoSwapLayout),
  tracker: new Tracker.Dependency(),
};

const setSwapLayout = () => {
  swapLayout.value = getFromUserSettings('autoSwapLayout', LAYOUT_CONFIG.autoSwapLayout);
  swapLayout.tracker.changed();
};

const toggleSwapLayout = () => {
  swapLayout.value = !swapLayout.value;
  swapLayout.tracker.changed();
};

export const shouldEnableSwapLayout = () => !shouldShowScreenshare() && !shouldShowExternalVideo();

export const getSwapLayout = () => {
  swapLayout.tracker.depend();
  return swapLayout.value;
};

export default {
  getPresentationInfo,
  shouldShowWhiteboard,
  shouldShowScreenshare,
  shouldShowExternalVideo,
  shouldShowOverlay,
  isUserPresenter,
  isVideoBroadcasting,
  toggleSwapLayout,
  shouldEnableSwapLayout,
  getSwapLayout,
  setSwapLayout,
};
