import type * as Types from '../../../../../constants/types/chat2'
import * as FsGen from '../../../../../actions/fs-gen'
import * as Chat2Gen from '../../../../../actions/chat2-gen'
import * as Constants from '../../../../../constants/chat2'
import * as Container from '../../../../../util/container'
import {globalColors} from '../../../../../styles'
import ImageAttachment from '.'
import {imgMaxWidth} from './image-render'

type OwnProps = {
  message: Types.MessageAttachment
  toggleMessageMenu: () => void
  isHighlighted?: boolean
}

const mapDispatchToProps = (dispatch: Container.TypedDispatch) => ({
  _onClick: (message: Types.MessageAttachment) =>
    dispatch(
      Chat2Gen.createAttachmentPreviewSelect({
        message,
      })
    ),
  _onCollapse: (message: Types.MessageAttachment) =>
    dispatch(
      Chat2Gen.createToggleMessageCollapse({
        collapse: !message.isCollapsed,
        conversationIDKey: message.conversationIDKey,
        messageID: message.id,
      })
    ),
  _onDoubleClick: (message: Types.MessageAttachment) =>
    dispatch(
      Chat2Gen.createAttachmentPreviewSelect({
        message,
      })
    ),
  _onRetry: (message: Types.MessageAttachment) =>
    dispatch(
      Chat2Gen.createAttachmentDownload({
        message,
      })
    ),
  _onShowInFinder: (message: Types.MessageAttachment) => {
    message.downloadPath &&
      dispatch(FsGen.createOpenLocalPathInSystemFileManager({localPath: message.downloadPath}))
  },
})

export default Container.connect(
  (state: Container.TypedState, ownProps: OwnProps) => {
    const editInfo = Constants.getEditInfo(state, ownProps.message.conversationIDKey)
    const isEditing = !!(editInfo && editInfo.ordinal === ownProps.message.ordinal)
    return {isEditing}
  },
  mapDispatchToProps,
  (stateProps, dispatchProps, ownProps: OwnProps) => {
    const {message} = ownProps
    const {height, width} = Constants.clampImageSize(
      message.previewWidth,
      message.previewHeight,
      Math.min(imgMaxWidth(), 320)
    )
    // On mobile we use this icon to indicate we have the file stored locally, and it can be viewed. This is a
    // similar meaning to desktop.
    const arrowColor = !Container.isMobile
      ? message.downloadPath
        ? globalColors.green
        : message.transferState === 'downloading'
        ? globalColors.blue
        : ''
      : ''
    const buttonType = message.showPlayButton ? 'play' : null
    const hasProgress =
      !!message.transferState &&
      message.transferState !== 'remoteUploading' &&
      message.transferState !== 'mobileSaving'

    return {
      arrowColor,
      downloadError: !!message.transferErrMsg,
      fileName: message.fileName,
      fullPath: message.fileURL,
      hasProgress,
      height,
      inlineVideoPlayable: message.inlineVideoPlayable,
      isCollapsed: message.isCollapsed,
      isEditing: stateProps.isEditing,
      isHighlighted: ownProps.isHighlighted,
      message,
      onClick: () => dispatchProps._onClick(message),
      onCollapse: () => dispatchProps._onCollapse(message),
      onDoubleClick: () => dispatchProps._onDoubleClick(message),
      onRetry: () => dispatchProps._onRetry(message),
      onShowInFinder:
        !Container.isMobile && message.downloadPath
          ? (e: React.SyntheticEvent) => {
              e.preventDefault()
              e.stopPropagation()
              dispatchProps._onShowInFinder(message)
            }
          : null,
      path: message.previewURL,
      progress: message.transferProgress,
      showButton: buttonType,
      title: message.decoratedText ? message.decoratedText.stringValue() : message.title,
      toggleMessageMenu: ownProps.toggleMessageMenu,
      transferState: message.transferState,
      videoDuration: message.videoDuration || '',
      width,
    }
  }
)(ImageAttachment as any) as any
