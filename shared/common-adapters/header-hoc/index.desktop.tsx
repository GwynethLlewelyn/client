import * as React from 'react'
import Text from '../text'
import BackButton from '../back-button'
import Box from '../box'
import Icon from '../icon'
import * as Styles from '../../styles'
import type {Props, LeftActionProps} from '.'

export const HeaderHocHeader = ({
  headerStyle,
  customComponent,
  title,
  titleComponent,
  onCancel,
  rightActions,
  theme = 'light',
}: Props) => (
  <Box style={Styles.collapseStyles([_headerStyle, _headerStyleThemed[theme], headerStyle] as any)}>
    {customComponent}
    {onCancel && (
      <Icon
        style={Styles.collapseStyles([_styleClose, _styleCloseThemed[theme]] as any)}
        type="iconfont-close"
        onClick={onCancel}
      />
    )}
    {title && (
      <Box style={_titleStyle}>
        <Text type="Header">{title}</Text>
      </Box>
    )}
    {titleComponent}
    {(rightActions || []).map(a => (a ? a.custom : null))}
  </Box>
)

// TODO use LeftAction above
export const LeftAction = ({
  badgeNumber,
  disabled,
  customCancelText,
  hasTextTitle,
  hideBackLabel,
  leftAction,
  leftActionText,
  onLeftAction,
  theme,
}: LeftActionProps) => (
  <Box style={Styles.collapseStyles([styles.leftAction, hasTextTitle && styles.grow])}>
    {onLeftAction &&
      (leftAction === 'cancel' ? (
        <Text type="BodyBigLink" style={styles.action} onClick={onLeftAction}>
          {leftActionText || customCancelText || 'Cancel'}
        </Text>
      ) : (
        <BackButton
          badgeNumber={badgeNumber}
          hideBackLabel={hideBackLabel}
          iconColor={
            disabled
              ? Styles.globalColors.black_10
              : theme === 'dark'
              ? Styles.globalColors.white
              : Styles.globalColors.black_50
          }
          style={styles.action}
          textStyle={disabled ? styles.disabledText : undefined}
          onClick={disabled ? undefined : onLeftAction}
        />
      ))}
  </Box>
)

export const HeaderHocWrapper = (props: Props & {children: React.ReactNode}) => {
  return props.children
}

const _headerStyle = {
  ...Styles.globalStyles.flexBoxRow,
  alignItems: 'center',
  flexShrink: 0,
  justifyContent: 'flex-start',
  minHeight: undefined,
  paddingLeft: Styles.globalMargins.small,
  paddingRight: Styles.globalMargins.small,
  position: 'relative',
}

const _headerStyleThemed = {
  dark: {
    backgroundColor: Styles.globalColors.blueDarker2,
  },
  light: {
    backgroundColor: Styles.globalColors.white,
  },
}

const _styleClose = {
  ...Styles.desktopStyles.clickable,
  position: 'absolute',
  right: Styles.globalMargins.small,
  top: Styles.globalMargins.small,
}

const _styleCloseThemed = {
  dark: {
    color: Styles.globalColors.white_40,
  },
  light: {
    color: Styles.globalColors.black_20,
  },
}

const _titleStyle = {
  ...Styles.globalStyles.flexBoxRow,
  alignItems: 'center',
  bottom: 0,
  flex: 1,
  justifyContent: 'center',
  left: 0,
  position: 'absolute', // This is always centered so we never worry about items to the left/right. If you have overlap or other issues you likely have to fix the content
  right: 0,
  top: 0,
}

const styles = Styles.styleSheetCreate(() => ({
  action: Styles.platformStyles({
    common: {
      opacity: 1,
      paddingBottom: Styles.globalMargins.tiny,
      paddingLeft: Styles.globalMargins.tiny,
      paddingRight: Styles.globalMargins.tiny,
      paddingTop: Styles.globalMargins.tiny,
    },
  }),
  disabledText: Styles.platformStyles({
    isElectron: {
      color: Styles.globalColors.black_50,
    },
  }),
  grow: {
    flexGrow: 1,
  },
  leftAction: Styles.platformStyles({
    common: {
      ...Styles.globalStyles.flexBoxColumn,
      alignItems: 'flex-start',
      flexShrink: 1,
      justifyContent: 'flex-start',
    },
    isIOS: {
      paddingLeft: Styles.globalMargins.tiny,
    },
  }),
}))

const noop = () => {}
export const HeaderLeftBlank = () => (
  <LeftAction badgeNumber={0} leftAction="back" onLeftAction={noop} style={{opacity: 0}} />
)

export const HeaderLeftArrow = hp =>
  hp.canGoBack ? (
    <LeftAction
      badgeNumber={0}
      leftAction="back"
      onLeftAction={hp.onPress} // react navigation makes sure this onPress can only happen once
      customIconColor={hp.tintColor}
    />
  ) : null

export const HeaderLeftCancel = hp =>
  hp.canGoBack ? (
    <LeftAction
      badgeNumber={0}
      leftAction="cancel"
      onLeftAction={hp.onPress} // react navigation makes sure this onPress can only happen once
      customIconColor={hp.tintColor}
    />
  ) : null
