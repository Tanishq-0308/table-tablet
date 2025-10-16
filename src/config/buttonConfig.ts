import heightUpBtn from "../assets/images/heightUp.png"
import planeImage from "../assets/images/planeImage.png"
import heightDownBtn from "../assets/images/heightDown.png"
import sideTiltLeftBtn from "../assets/images/tiltLeftBtn.png"
import tiltImage from "../assets/images/tiltImage.png"
import sideTiltRightBtn from "../assets/images/tiltRightBtn.png"
import flexBtn from "../assets/images/flexBtn.png"
import reflexBtn from "../assets/images/reflexBtn.png"
import flexImage from "../assets/images/flexImage.png"
import trendBtn from "../assets/images/trendBtn.png"
import trendImage from "../assets/images/trendImage.png"
import revTrendBtn from "../assets/images/revTrendBtn.png"
import lockBtn from "../assets/images/lockBtn.png"
import lockImage from "../assets/images/lockImage.png"
import unlockBtn from "../assets/images/unlockBtn.png"
import zeroBtn from "../assets/images/zeroBtn.png"
import reverseImage from "../assets/images/reverseImage.png"
import revOrientBtn from "../assets/images/orientBtn.png"
import backUpBtn from "../assets/images/backUP.png"
import backImage from "../assets/images/backImage.png"
import backDownBtn from "../assets/images/backDown.png"
import slideBtn from "../assets/images/slideBtn.png"
import revSlideBtn from "../assets/images/revSlideBtn.png"
import fLockBtn from "../assets/images/fLock.png"
import fUnlockBtn from "../assets/images/fUnlock.png"
import { ImageSourcePropType } from "react-native"

export type ButtonType = 'standard' | 'single'; // standard = 3 components, single = 2 components

export interface ButtonConfig {
    id: string;
    type: ButtonType;
    upButton: ImageSourcePropType;
    middleImage: ImageSourcePropType;
    downButton?: ImageSourcePropType;
    label: string;
    isFixed: boolean;
}

export const FIRST_PAGE_BUTTONS: ButtonConfig[] = [
    // Fixed buttons (1-7)
    {
        id:'btn1',
        type:'standard',
        upButton:heightUpBtn,
        middleImage:planeImage,
        downButton:heightDownBtn,
        label: 'Height',
        isFixed: true,
    },
    {
        id:'btn2',
        type:'standard',
        upButton:trendBtn,
        middleImage:trendImage,
        downButton:revTrendBtn,
        label: 'Trend',
        isFixed: true,
    },
    {
        id:'btn3',
        type:'standard',
        upButton:backUpBtn,
        middleImage:backImage,
        downButton:backDownBtn,
        label: 'Back',
        isFixed: true,
    },
    {
        id:'btn4',
        type:'standard',
        upButton:sideTiltLeftBtn,
        middleImage:tiltImage,
        downButton:sideTiltRightBtn,
        label: 'Tilt',
        isFixed: true,
    },
    {
        id:'btn5',
        type:'standard',
        upButton:lockBtn,
        middleImage:lockImage,
        downButton:unlockBtn,
        label: 'Lock',
        isFixed: true,
    },
    {
        id:'btn6',
        type:'single',
        upButton:zeroBtn,
        middleImage:planeImage,
        label: 'Zero',
        isFixed: true,
    },
    {
        id:'btn7',
        type:'single',
        upButton:revOrientBtn,
        middleImage:reverseImage,
        label: 'Reverse',
        isFixed: true,
    },
    {
        id:'btn8',
        type:'standard',
        upButton:slideBtn,
        middleImage:planeImage,
        downButton:revSlideBtn,
        label: 'Slide',
        isFixed: false,
    },
    {
        id:'btn9',
        type:'standard',
        upButton:flexBtn,
        middleImage:flexImage,
        downButton:reflexBtn,
        label: 'Flex',
        isFixed: false,
    },
    {
        id:'btn10',
        type:'standard',
        upButton:fLockBtn,
        middleImage:tiltImage,
        downButton:fUnlockBtn,
        label: 'Floor',
        isFixed: false,
    },
];