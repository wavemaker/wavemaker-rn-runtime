import Color, { rgb } from "color";

export class ThemeVariables {
    primaryColor = '#4263eb';
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
    defaultTextColor = '#151420';
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
    baseFont = 'Roboto, "Helvetica Neue", Helvetica, Arial, sans-serif';

    // page
    pageContentBgColor = '#eeeeee';

    // common widget color
    widgetHeaderBgColor = Color(this.pageContentBgColor).darken(0.1).rgb().toString();
    widgetHeaderTextColor = this.defaultTextColor;
    widgetActiveHeaderBgColor = this.primaryColor;
    widgetActiveHeaderTextColor = this.primaryContrastColor;
    widgetBorderColor = Color(this.defaultColorD).alpha(0.5).rgb().toString();
    widgetBgColor = this.defaultColorF;

    // Navbar variables
    navbarBackgroundColor = '#ffffff';
    navbarBorderColor = this.widgetBorderColor;
    navbarTextColor = '#151420';
    navbarIconSize = 32;
    navbarFontSize = 24;
    navbarImageSize = 24;
    navbarCaretColor = this.primaryColor;
    navitemChildBackgroundColor = this.primaryContrastColor;
    navitemChildTextColor = this.defaultColor;
    navitemChildIconColor = this.defaultColor6;
    navitemActiveBackgroundColor = this.primaryColor;
    navitemActiveTextColor = this.primaryContrastColor;
    navitemActiveIconColor = this.navitemActiveTextColor;

    //Anchor variables
    linkDefaultColor = this.defaultTextColor;
    linkPrimaryColor = this.primaryColor;
    linkSecondaryColor = this.secondaryColor;
    linkSuccessColor = this.successColor;
    linkInfoColor = this.infoColor;
    linkWarningColor = this.warningColor;
    linkDangerColor = this.dangerColor;
    linkLightColor = this.lightColor;
    linkDarkColor = this.darkColor;
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
    tabbarBackgroundColor = this.primaryContrastColor;
    tabbarTextColor =  this.primaryColor;
    tabbarIconColor = this.primaryColor;

    // tab variables
    tabBorderColor = this.widgetBorderColor;
    tabHeaderTextColor = this.widgetActiveHeaderBgColor;
    tabContentBgColor = this.widgetBgColor;

    //label Variables
    labelDefaultColor = this.defaultColor8;
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
    itemBgColor = this.defaultColorF;
    selectedItemBorderColor = this.primaryColor;

    //button Variables
    buttonBorderColor = this.widgetBorderColor;
    buttonBadgeBackgroundColor = this.badgeColor;
    buttonBadgeTextColor = this.badgeContrastColor;
    buttonTextPadding = 2;
    buttonSuccessColor = this.successColor;
    buttonDefaultColor = this.defaultColorF;
    buttonPrimaryColor = this.primaryColor;
    buttonSecondaryColor = this.defaultColorF;
    buttonDangerColor = this.dangerColor;
    buttonWarningColor = this.warningColor;
    buttonInfoColor = this.infoColor;
    buttonSuccessTextColor = this.successContrastColor;
    buttonDefaultTextColor = this.defaultTextColor;
    buttonPrimaryTextColor = this.primaryContrastColor;
    buttonSecondaryTextColor = this.primaryColor;
    buttonDangerTextColor = this.dangerContrastColor;
    buttonWarningTextColor = this.warningContrastColor;
    buttonInfoTextColor = this.infoContrastColor;
    buttonLinkColor = this.defaultColorF;
    buttonLinkTextColor = this.primaryColor;
    buttonDarkColor = this.darkColor;
    buttonDarkTextColor = this.lightColor;
    buttonLightColor = this.lightColor;
    buttonLightTextColor = this.darkColor;
    buttonGrpBorderColor = this.widgetBorderColor;
    buttonGrpBgColor = this.defaultColorF;

    //picture variables
    pictureThumbBgColor = this.defaultColorF;
    pictureThumbBorderColor = this.defaultColorD;

    //input variables
    inputTextColor = this.defaultTextColor;
    inputBorderColor = Color(this.defaultColorD).alpha(0.5).rgb().toString();
    inputBackgroundColor = this.defaultColorF;
    inputFocusBorderColor = this.primaryColor;
    inputInvalidBorderColor = this.dangerColor;

    //slider variables
    minimumTrackTintColor = this.primaryColor;
    maximumTrackTintColor = this.widgetHeaderBgColor;
    thumbTintColor = this.primaryColor;

    //rating color
    ratingIconColor = this.defaultColorA;
    ratingSelectedIconColor = '#eb8600';

    //toggle variables
    toggleColor = this.primaryColor;

    // radioset, checkboxset variables
    groupHeadingBgColor = this.defaultColorD;
    checkedColor = this.primaryColor;

    //form
    formBorderColor = this.widgetBorderColor;
    formTitleColor = this.widgetHeaderTextColor;
    formSubTitleColor = this.defaultColor6;

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
    messageSuccessColor = this.successColor;
    messageErrorColor = this.dangerColor;
    messageWarningColor = this.warningColor;
    messageInfoColor = this.infoColor;
    messageLoadingColor = this.infoColor;

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
    accordionHeaderBgColor = this.defaultColorF;
    accordionIconColor= this.defaultColorB;
    accordionActiveIconColor= this.defaultColorF;
    accordionActiveHeaderBgColor = this.widgetActiveHeaderBgColor;
    accordionActiveHeaderTextColor = this.widgetActiveHeaderTextColor;
    accordionBorderColor = this.defaultColorE;

    //carousel
    carouselPrevBtnColor=this.defaultColorF;
    carouselNextBtnColor=this.defaultColorF;
    carouselDotWrapperBgColor=this.transparent;
    carouselDotColor=this.defaultColorF;
    carouselActiveDotColor=this.defaultColorF;

    //calendar
    calendarBgColor = this.defaultColorF;
    calendarHeaderBgColor = this.defaultColorF;
    calendarHeaderTextColor = this.defaultTextColor;
    calendarWeekDayTextColor = this.defaultColorA;
    calendarDateColor = this.defaultColor;
    calendarNotCurrentMonthDateColor = this.defaultColor6;
    calendarHeaderColor = this.defaultColorF;
    calendarPrevYearIconColor = this.defaultColorA;
    calendarNextYearIconColor = this.defaultColorA;
    calendarPrevMonthIconColor = this.defaultColorA;
    calendarNextMonthIconColor = this.defaultColorA;
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
    wizardStepDoneColor = this.primaryColor;
    wizardStepDoneTextColor = this.defaultColorF;
    wizardStepColor = this.primaryColor;
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
    loginErrorMsgColor = this.dangerContrastColor;
    loginErrorMsgBgColor = this.dangerColor;
    loginErrorMsgBorderColor = this.dangerColor;

    //camera
    cameraBgColor = this.transparent;
    cameraBorderColor = this.widgetBorderColor;
    cameraTextColor = this.defaultTextColor;

    //barcode-scanner
    barcodeScannerBgColor = this.transparent;
    barcodeScannerBorderColor = this.widgetBorderColor;
    barcodeScannerTextColor = this.defaultTextColor;
}

export default new ThemeVariables();
