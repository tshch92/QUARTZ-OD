import { accordion } from "./accordion";
import { siteExamples } from "./siteexamples";
import { slickSlider } from "./slick-slider-initiate";

import 'slick-carousel/slick/slick-theme.scss';
import 'slick-carousel/slick/slick.scss';
import '../scss/styles.scss';

import { initialIndex } from "./index";
import { headerMob } from "./headermob";

window.$ = $.jQuery = $;

accordion();
slickSlider();
siteExamples();
initialIndex();
headerMob();