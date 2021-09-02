import Color from "color";

export class ThemeVariables {
    primaryColor = '#007bff';
    primaryColor1 = Color(this.primaryColor).lighten(0.2).rgb().toString();
    primaryColor2 = Color(this.primaryColor).lighten(0.4).rgb().toString();
    primaryColor3 = Color(this.primaryColor).lighten(0.6).rgb().toString();
    primaryContrastColor = '#ffffff';
    secondaryColor = '#6c757d';
    secondaryContrastColor = '#ffffff';
    successColor = '#28a745';
    successContrastColor = '#ffffff';
    infoColor = '#17a2b8';
    infoContrastColor = '#ffffff';
    warningColor = '#ffc107';
    warningContrastColor = '#ffffff';
    dangerColor = '#dc3545';
    dangerContrastColor = '#ffffff';
    defaultColor = '#000000';
    defaultColor1 = '#111111';
    defaultColor2 = '#222222';
    defaultColor3 = '#333333';
    defaultColor4 = '#444444';
    defaultColor5 = '#555555';
    defaultColor6 = '#666666';
    defaultColor7 = '#777777';
    defaultColor8 = '#888888';
    defaultColor9 = '#999999';
    defaultColorA = '#aaaaaa';
    defaultColorB = '#bbbbbb';
    defaultColorC = '#cccccc';
    defaultColorD = '#dddddd';
    defaultColorE = '#eeeeee';
    defaultColorF = '#ffffff';
    defaultBgColor = this.defaultColorF;
    defaultTextColor = this.defaultColor;
    lightColor = this.defaultColorF;
    darkColor = this.defaultColor;
    muteColor = this.defaultColorA;
    heading1FontSize = 36;
    heading2FontSize = 30;
    heading3FontSize = 24;
    heading4FontSize = 18;
    heading5FontSize = 14;
    heading6FontSize = 12;
    transparent = 'transparent';
    badgeColor = '#6c757d';
    badgeContrastColor = '#ffffff';

    // page
    pageContentBgColor = '#ffffff';

    // common widget color
    widgetHeaderBgColor = Color(this.pageContentBgColor).darken(0.1).rgb().toString();
    widgetHeaderTextColor = this.defaultTextColor;
    widgetActiveHeaderBgColor = this.primaryColor;
    widgetActiveHeaderTextColor = this.primaryContrastColor;
    widgetBorderColor = this.defaultColorC;
    widgetBgColor = this.pageContentBgColor;

    // Navbar variables
    navbarBackgroundColor = this.primaryColor;
    navbarBorderColor = this.widgetBorderColor;
    navbarTextColor = this.primaryContrastColor;
    navbarIconSize = 24;
    navbarFontSize = 15;
    navbarImageSize = 24;
    navbarCaretColor = this.primaryColor;
    navitemChildBackgroundColor = this.primaryContrastColor;
    navitemChildTextColor = this.defaultColor;
    navitemChildIconColor = this.defaultColor6;
    navitemActiveBackgroundColor = this.primaryColor;
    navitemActiveTextColor = this.primaryContrastColor;
    navitemActiveIconColor = this.navitemActiveTextColor;

    //Anchor variables
    linkPrimaryColor = this.primaryColor;
    linkSecondaryColor = this.secondaryColor;
    linkSuccessColor = this.successColor;
    linkInfoColor = this.infoColor;
    linkWarningColor = this.warningColor;
    linkDangerColor = this.dangerColor;
    linkLightColor = this.lightColor;
    linkDarkColor = this.darkColor;
    linkBadgeBackgroundColor = this.badgeColor;
    linkBadgeTextColor = this.badgeContrastColor;
    anchorTextPadding = 2;

    //Grid Layout variables
    layoutGridBgColor = this.widgetBgColor;
    layoutGridBorderColor = this.widgetBorderColor;
    layoutGridStripColor1 = Color(this.primaryColor).lighten(0.9).rgb().toString();
    layoutGridHeaderBgColor = this.widgetHeaderBgColor;
    layoutGridHeaderTextColor = this.widgetHeaderTextColor;
    layoutGridStripColor2 = this.transparent;
    gridColumnBorderColor = this.widgetBorderColor;

    //Spinner Variables
    spinnerIconColor = this.primaryColor;

    //tabbar variables
    tabbarBackgroundColor = this.primaryColor;
    tabbarTextColor =  this.primaryContrastColor;
    tabbarIconColor = this.primaryContrastColor;

    // tab variables
    tabBorderColor = this.widgetBorderColor;
    tabHeaderTextColor = this.widgetActiveHeaderBgColor;
    tabContentBgColor = this.widgetBgColor;

    //label Variables
    labelDefaultColor = this.defaultColor;
    labelDefaultContrastColor = this.defaultColorF;
    labelDangerColor = this.dangerColor;
    labelDangerContrastColor = this.dangerContrastColor;
    labelInfoColor = this.infoColor;
    labelInfoContrastColor = this.infoContrastColor;
    labelPrimaryColor = this.primaryColor;
    labelPrimaryContrastColor = this.primaryContrastColor;
    labelSuccessColor = this.successColor;
    labelSuccessContrastColor = this.successContrastColor;
    labelWarningColor = this.warningColor;
    labelWarningContrastColor = this.warningContrastColor;
    labelTextSuccessColor = this.successColor;
    labelTextDangerColor = this.dangerColor;
    labelTextInfoColor = this.infoColor;
    labelTextMutedColor = this.muteColor;
    labelTextPrimaryColor = this.primaryColor;
    labelTextWarningColor = this.warningColor;
    labelAsteriskColor = this.dangerColor;

    //List
    listHeaderBgColor = this.widgetHeaderBgColor;
    listTitleColor = this.widgetHeaderTextColor;
    listSubTitleColor = this.defaultColor6;
    listDividerColor = this.widgetBorderColor;
    selectedItemBorderColor = this.primaryColor;

    //button Variables
    buttonBorderColor = this.widgetBorderColor;
    buttonBadgeBackgroundColor = this.badgeColor;
    buttonBadgeTextColor = this.badgeContrastColor;
    buttonTextPadding = 2;
    buttonSuccessColor = this.successColor;
    buttonDefaultColor = this.transparent;
    buttonPrimaryColor = this.primaryColor;
    buttonSecondaryColor = this.primaryColor2;
    buttonDangerColor = this.dangerColor;
    buttonWarningColor = this.warningColor;
    buttonInfoColor = this.infoColor;
    buttonSuccessTextColor = this.successContrastColor;
    buttonDefaultTextColor = this.defaultTextColor;
    buttonPrimaryTextColor = this.primaryContrastColor;
    buttonSecondaryTextColor = this.primaryContrastColor;
    buttonDangerTextColor = this.dangerContrastColor;
    buttonWarningTextColor = this.warningContrastColor;
    buttonInfoTextColor = this.infoContrastColor;
    buttonLinkColor = this.transparent;
    buttonLinkTextColor = this.primaryColor;
    buttonDarkColor = this.darkColor;
    buttonDarkTextColor = this.lightColor;
    buttonLightColor = this.lightColor;
    buttonLightTextColor = this.darkColor;
    buttonGrpBorderColor = this.widgetBorderColor;
    buttonGrpBgColor = this.defaultColorE;

    //picture variables
    pictureThumbBgColor = this.defaultColorF;
    pictureThumbBorderColor = this.defaultColorD;

    //input variables
    inputTextColor = this.defaultTextColor;
    inputBorderColor = this.defaultColorA;
    inputBackgroundColor = this.defaultColorF;
    inputFocusBorderColor = this.primaryColor;
    inputInvalidBorderColor = this.dangerColor;

    //slider variables
    minimumTrackTintColor = this.widgetHeaderBgColor;
    maximumTrackTintColor = this.widgetHeaderBgColor;
    thumbTintColor = this.primaryColor;

    //rating color
    ratingIconColor = this.defaultColorA;
    ratingSelectedIconColor = this.primaryColor;

    //toggle variables
    toggleColor = this.primaryColor;

    // radioset, checkboxset variables
    groupHeaderBackgroundColor = this.defaultColorD;
    checkedColor = this.primaryColor;

    //form
    formTitleColor = this.defaultColor5;
    formSubTitleColor = this.formTitleColor;

    //dialog
    dialogBackgroundColor = this.widgetBgColor;
    dialogBorderColor = this.widgetBorderColor;

    badgeTextColor = this.defaultColorF;

    //popover
    popoverBackgroundColor = this.defaultColorF;
    popoverTitleBackgroundColor = this.defaultColorD;
    popoverTitleColor = this.defaultColor1;

    //menu
    menuIconColor = this.defaultColor6;
    menuTextColor = this.defaultColor6;
    menuBackgroundColor = this.popoverBackgroundColor;
    menuItemBorderColor = this.widgetBorderColor;
    menuItemIconColor = this.defaultColor6;
    menuItemTextColor = this.defaultColor6;

    //tile Variables
    tileDangerColor = this.dangerColor;
    tileInfoColor = this.infoColor;
    tilePrimaryColor = this.primaryColor;
    tileSuccessColor = this.successColor;
    tileWarningColor = this.warningColor;
    tileWellbgColor = this.defaultColorF;
    tileWellBorderColor = this.defaultColorE;
    tilePrimaryTextColor = this.primaryContrastColor;

    //switch
    switchBgColor = this.widgetBgColor;
    switchTextColor = this.defaultTextColor;
    switchActiveBgColor = this.primaryColor;
    switchActiveTextColor = this.primaryContrastColor;
    switchBorderColor = this.widgetBorderColor;

    //message
    messageDefaultTextColor  = this.defaultColorF;
    messageDefaultIconColor = this.defaultColorF;
    messageDefaultCloseBtnColor = Color(this.defaultColor6).fade(0.5).toString();
    messageSuccessBackgroundColor = this.successColor;
    messageSuccessIconColor = this.messageDefaultIconColor;
    messageSuccessTextColor = this.messageDefaultTextColor;
    messageSuccessCloseBtnColor = this.messageDefaultCloseBtnColor;
    messageErrorBackgroundColor = this.dangerColor;
    messageErrorIconColor = this.messageDefaultIconColor;
    messageErrorCloseBtnColor = this.messageDefaultCloseBtnColor;
    messageErrorTextColor = this.messageDefaultTextColor;
    messageWarningBackgroundColor = this.warningColor;
    messageWarningIconColor = this.messageDefaultIconColor;
    messageWarningCloseBtnColor = this.messageDefaultCloseBtnColor;
    messageWarningTextColor = this.messageDefaultTextColor;
    messageInfoBackgroundColor = this.infoColor;
    messageInfoIconColor = this.messageDefaultIconColor;
    messageInfoCloseBtnColor = this.messageDefaultCloseBtnColor;
    messageInfoTextColor = this.messageDefaultTextColor;
    messageLoadingBackgroundColor = this.infoColor;
    messageLoadingIconColor = this.messageDefaultIconColor;
    messageLoadingCloseBtnColor = this.messageDefaultCloseBtnColor;
    messageLoadingTextColor = this.messageDefaultTextColor;

    //panel
    panelBgColor = this.widgetBgColor;
    panelHeaderBgColor = this.widgetHeaderBgColor;
    panelHeaderTextColor = this.widgetHeaderTextColor;
    panelFooterColor = Color(this.widgetBorderColor).fade(0.7).rgb().toString();
    panelBorderColor = this.widgetBorderColor;
    panelDangerColor = this.dangerColor;
    panelDefaultColor = this.defaultColor;
    panelInfoColor = this.infoColor;
    panelPrimaryColor = this.primaryColor;
    panelSuccessColor = this.successColor;
    panelWarningColor = this.warningColor;
    panelTextColor = this.defaultColorF;

    //card
    cardHeaderBgColor = this.defaultColorD;
    cardBgColor = this.widgetBgColor;
    cardTitleColor = this.listTitleColor;
    cardShadowColor = this.defaultColor;
    cardSubTitleColor = this.listSubTitleColor;
    cardBorderColor = this.defaultColorD;
    cardContentBgColor = this.defaultColorF;
    cardFooterBgColor = this.defaultColorF;

    //progress bar
    progressBarDefaultColor = this.primaryColor;
    progressBarSuccessColor = this.successColor;
    progressBarDangerColor = this.dangerColor;
    progressBarInfoColor = this.infoColor;
    progressBarWarningColor = this.warningColor;

    //progress circle
    progressCircleDefaultColor = this.primaryColor;
    progressCircleSuccessColor = this.successColor;
    progressCircleDangerColor = this.dangerColor;
    progressCircleInfoColor = this.infoColor;
    progressCircleWarningColor = this.warningColor;


    //accordion
    accordionBgColor = this.widgetBgColor;
    accordionTitleColor = this.widgetHeaderTextColor;
    accordionHeaderBgColor = this.widgetHeaderBgColor;
    accordionActiveHeaderBgColor = this.widgetActiveHeaderBgColor;
    accordionActiveHeaderTextColor = this.widgetActiveHeaderTextColor;
    accordionBorderColor = this.widgetBorderColor;

    //carousel
    carouselPrevBtnColor=this.defaultColorF;
    carouselNextBtnColor=this.defaultColorF;
    carouselDotWrapperBgColor=this.transparent;
    carouselDotColor=this.defaultColorF;
    carouselActiveDotColor=this.primaryColor;

    //calendar
    calendarBgColor = this.transparent;
    calendarHeaderBgColor = this.primaryColor;
    calendarHeaderTextColor = this.defaultColorF;
    calendarWeekDayTextColor = this.primaryColor;
    calendarDateColor = this.defaultColor;
    calendarNotCurrentMonthDateColor = this.defaultColor6;
    calendarHeaderColor = this.defaultColorF;
    calendarPrevYearIconColor = this.calendarHeaderColor;
    calendarNextYearIconColor = this.calendarHeaderColor;
    calendarPrevMonthIconColor = this.calendarHeaderColor;
    calendarNextMonthIconColor = this.calendarHeaderColor;
    calendarDayBgColor = this.defaultColor;
    calendarSelectedDayBgColor = this.primaryColor;
    calendarSelectedDayTextColor = this.defaultColorF;
    calendarTodayBgColor = this.defaultColorD;
    calendarEventDay1Color = this.primaryColor1;
    calendarEventDay2Color = this.primaryColor2;
    calendarEventDay3Color = this.primaryColor3;

    //wizard
    wizardBackgroundColor = this.widgetBgColor;
    wizardStepActiveColor = this.primaryColor;
    wizardStepDoneColor = this.successColor;
    wizardStepColor = this.defaultColorA;
    wizardNextBtnColor= this.primaryColor;
    wizardDoneBtnColor = this.successColor;
    wizardStepConnectorColor = this.defaultColorE;
    wizardStepCounerColor = this.defaultColor9;
    wizardBorderColor = this.widgetBorderColor;

    //Search
    searchBorderColor = this.defaultColorD;
    searchButtonColor = this.primaryColor;
    searchButtonTextColor = this.primaryContrastColor;
    searchItemBorderColor = this.defaultColorD;
    searchItemTextColor = this.defaultColor6;
    searchDropdownBackgroundColor = this.defaultColorF;
    searchDataCompleteItemBgColor = this.defaultColorE;

    //Login
    loginErrorMsgColor = '#ffffff';
    loginErrorMsgBgColor = '#F44336';
    loginErrorMsgBorderColor = '#f31e33';


}

export default new ThemeVariables();
