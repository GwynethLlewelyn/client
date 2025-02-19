import * as Container from '../../../../../util/container'
import type * as Types from '../../../../../constants/types/chat2'
import * as Constants from '../../../../../constants/chat2'
import type {StylesCrossPlatform} from '../../../../../styles'
import ExplodingMeta, {type Props as ViewProps} from '.'

const emptyProps = {
  exploded: true,
  explodesAt: 0,
  exploding: false,
  messageKey: '',
  pending: false,
}

export type OwnProps = {
  conversationIDKey: Types.ConversationIDKey
  isParentHighlighted: boolean
  onClick?: () => void
  ordinal: Types.Ordinal
  style?: StylesCrossPlatform
}
const mapStateToProps = (state: Container.TypedState, ownProps: OwnProps) => {
  const message = Constants.getMessage(state, ownProps.conversationIDKey, ownProps.ordinal)
  if (!message || (message.type !== 'text' && message.type !== 'attachment') || !message.exploding) {
    return emptyProps
  }
  return {
    exploded: message.exploded,
    explodesAt: message.explodingTime,
    exploding: message.exploding,
    messageKey: Constants.getMessageKey(message),
    pending: !!message.submitState && ['pending', 'failed'].includes(message.submitState),
  }
}

type WrapperProps = {exploding: boolean} & ViewProps

const Wrapper = (props: WrapperProps) =>
  !props.exploding ? null : (
    <ExplodingMeta
      exploded={props.exploded}
      explodesAt={props.explodesAt}
      isParentHighlighted={props.isParentHighlighted}
      messageKey={props.messageKey}
      onClick={props.onClick}
      pending={props.pending}
      style={props.style}
    />
  )

const Connected = Container.connect(
  mapStateToProps,
  () => ({}),
  (stateProps, _, ownProps: OwnProps) => ({
    exploded: stateProps.exploded,
    explodesAt: stateProps.explodesAt,
    exploding: stateProps.exploding,
    isParentHighlighted: ownProps.isParentHighlighted,
    messageKey: stateProps.messageKey,
    onClick: ownProps.onClick,
    pending: stateProps.pending,
    style: ownProps.style,
  })
)(Wrapper)
export default Connected
