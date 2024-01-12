import Color, { rgb } from "color";
import { Dimensions, StatusBar } from "react-native";

export default class ThemeVariables {
    
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
    baseFont = 'Roboto';
    maxModalHeight = Dimensions.get('window').height - 64 - (StatusBar.currentHeight || 0);
    maxWidth = Dimensions.get("window").width; 

    // page
    pageContentBgColor = this.defaultColorE;

    // common widget color
    widgetHeaderBgColor = this.defaultColorF;
    widgetHeaderTextColor = this.defaultColor3;
    widgetActiveHeaderBgColor = this.primaryColor;
    widgetActiveHeaderTextColor = this.primaryContrastColor;
    widgetBorderColor = this.defaultColorC;
    widgetBgColor = this.defaultColorF;

    // Navbar variables
    navbarBackgroundColor = this.defaultColorF;
    navbarBorderColor = this.widgetBorderColor;
    navbarTextColor = '#151420';
    navbarIconSize = 32;
    navbarFontSize = 24;
    navbarImageSize = 32;
    navbarCaretColor = this.primaryColor;
    navitemChildBackgroundColor = this.primaryContrastColor;
    navitemChildTextColor = this.primaryColor;
    navitemChildIconColor = this.primaryColor;
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
    tabShadowColor = this.defaultColor;
    tabActiveBackgroundColor = this.secondaryColor;
    tabActiveIconColor = this.secondaryColor;
    tabLabelTextColor = this.defaultColor3;
    centerHubItemColor = this.secondaryColor;
    centerHubIconColor = this.defaultColorF;
    centerHubLabelColor = this.defaultColorF;


    // tab variables
    tabHeaderBgColor = this.widgetBgColor;
    tabHeaderTextColor =  this.defaultColorA;
    tabHeaderIconColor = this.defaultColorA;
    tabActiveHeaderBgColor = this.defaultColorF;
    tabActiveHeaderTextColor =  this.primaryColor;
    tabActiveIndicatorBgColor =  this.primaryColor;
    tabActiveHeaderIconColor = this.primaryColor;
    tabBorderColor = this.widgetBorderColor;
    tabContentBgColor = this.widgetBgColor;
    tabArrowIndicatorBgColor = this.tabContentBgColor;
    tabArrowIndicatorDotColor = this.primaryColor;

    //label Variables
    labelHeaderColor = '#151420';
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
    buttonLinkColor = this.transparent;
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
    inputBorderColor = this.defaultColorD;
    inputBackgroundColor = this.defaultColorF;
    inputDisabledBgColor = '#f6f6f6';
    inputFocusBorderColor = this.primaryColor;
    inputInvalidBorderColor = this.dangerColor;
    inputPlaceholderColor = this.defaultColorB;

    //slider variables
    minimumTrackTintColor = this.primaryColor;
    maximumTrackTintColor = this.widgetHeaderBgColor;
    thumbTintColor = this.primaryColor;

    //rating color
    ratingIconColor = this.defaultColorA;
    ratingSelectedIconColor = '#eb8600';

    //toggle variables
    toggleOnColor = Color(this.primaryColor).lighten(0.4).rgb().toString();
    toggleOffColor = this.defaultColorB;
    toggleHandleColor = this.primaryColor;
    toggleHandleDisableColor = this.defaultColorA;
    toggleOffBorderColor = this.defaultColorB;
    toggleUnselectedTrackbgColor = this.defaultColorC;

    // radioset, checkboxset variables
    groupHeadingBgColor = this.transparent;
    checkedColor = this.primaryColor;
    checkedDisabledColor = this.defaultColorA;

    //form
    formBorderColor = this.widgetBorderColor;
    formTitleColor = this.defaultTextColor;
    formSubTitleColor = this.defaultColor6;

    //dialog
    dialogBackgroundColor = this.widgetBgColor;
    dialogBorderColor = this.widgetBorderColor;
    dialogCloseIconColor = this.defaultColorA;
    dialogLabelColor = this.defaultColor3;
    dialogIconColor = this.defaultColor4;
    dialogSupportingTextColor = this.defaultColor1;

    //alert dialog
    alertMessageColor = this.defaultColor8;

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
    panelFooterColor = this.defaultColorD;
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
    cardFooterBorderColor = this.defaultColorD;

    //progress bar
    progressBarDefaultColor = this.primaryColor;
    progressBarTrackColor = this.defaultColorD;
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

    //container
    containerOutlineColor = this.defaultColorC;

    //accordion
    accordionBgColor = this.widgetBgColor;
    accordionTitleColor = this.widgetHeaderTextColor;
    accordionHeaderBgColor = this.defaultColorF;
    accordionIconColor= this.defaultColorB;
    accordionActiveIconColor= this.defaultColorF;
    accordionActiveHeaderBgColor = this.widgetActiveHeaderBgColor;
    accordionActiveHeaderTextColor = this.widgetActiveHeaderTextColor;
    accordionBorderColor = this.defaultColorE;
    accordionPaneBgColor = this.defaultColorF;

    //carousel
    carouselPrevBtnColor=this.defaultColorF;
    carouselPrevBgColor=Color(this.defaultColorF).fade(0.6).rgb().toString();
    carouselNextBtnColor=this.defaultColorF;
    carouselNextBgColor=Color(this.defaultColorF).fade(0.6).rgb().toString();
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
    calendarTodayBgColor = this.defaultColorE;
    calendarEventDay1Color = this.primaryColor1;
    calendarEventDay2Color = this.primaryColor2;
    calendarEventDay3Color = this.primaryColor3;

    //date picker
    datepickerBgColor = this.defaultColorF;

    //wizard
    wizardBackgroundColor = this.widgetBgColor;
    wizardStepActiveColor = this.primaryColor;
    wizardStepDoneColor = this.successColor;
    wizardStepDoneTextColor = this.defaultColorF;
    wizardStepIconColor = this.defaultColor9;
    wizardStepColor = this.defaultColor9;
    wizardActiveStepColor = this.defaultColorF;
    wizardDoneStepColor = this.defaultColorF;
    wizardStepTitleColor = this.defaultColorA;
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
    searchBgContainerColor = this.defaultColorD;
    //Select
    selectBorderColor = this.defaultColorD;
    selecttemBorderColor = this.defaultColorD;
    selectItemTextColor = this.defaultColor6;
    selectDropdownBackgroundColor = this.defaultColorF;

    //Chip
    chipActiveTextColor = this.defaultColorF;
    chipDefaultTextColor = this.defaultColorA;
    chipborderColor = this.defaultColorD;
    chipContainerColor = this.defaultColor2; 
    chipIconColor = this.primaryColor;
    chipSelectedOutlineColor = this.defaultColor6;
    chipSelectedContainerColor = this.defaultColor7;
    //Login
    loginErrorMsgColor = this.dangerContrastColor;
    loginErrorMsgBgColor = this.dangerColor;
    loginErrorMsgBorderColor = this.dangerColor;

    //camera
    cameraBgColor = this.defaultColorF;
    cameraBorderColor = this.widgetBorderColor;
    cameraTextColor = this.defaultTextColor;

    //barcode-scanner
    barcodeScannerBgColor = this.defaultColorF;
    barcodeScannerBorderColor = this.widgetBorderColor;
    barcodeScannerTextColor = this.defaultTextColor;

    //fileupload
    fileuploadBgColor = this.defaultColorF;
    fileuploadBorderColor = this.widgetBorderColor;
    fileuploadTextColor = this.defaultTextColor;

    //charts
    chartLabelColor = this.defaultTextColor;
    chartGraphLinesColor = this.defaultColorC;
    chartLineColor = this.defaultColor8;
    chartLegendBorder = this.defaultColor7;
    chartAxisColor = this.defaultColor5;
    chartAxisPointColor = this.defaultColor9;
    chartTitleColor = this.widgetHeaderTextColor;
    chartSubTitleColor = this.defaultColor6;

    // Network Toast
    networkToastBgColor = this.defaultColor3;
    networkToastTextColor = this.defaultColorF;
    networkToastActionTextColor = this.primaryColor;
    networkToastActionSeparatorColor = this.networkToastTextColor;

    // Skeleton
    skeletonBgColor = this.defaultColorE;
    skeletonAnimatedBgColor = this.defaultColorE;
    skeletonGradientBgColor = this.defaultColorF;
    skeletonGradientShadowColor = this.defaultColorF;
    skeletonGradientForegroundColor = this.transparent;

    // Audio
    audioPlayerBgColor = this.defaultColorF;
    audioPlayerFgColor = this.defaultColor3;

    static INSTANCE = new ThemeVariables();
}