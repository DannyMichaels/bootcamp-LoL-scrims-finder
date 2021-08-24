import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import { Button, FormHelperText } from '@material-ui/core';
import { useContext } from 'react';
import { CurrentUserContext } from '../../context/currentUser';
import { useHistory } from 'react-router-dom';

export default function Navbar({
  toggleFetch,
  setScrimsRegion,
  scrimsRegion,
  onSelectRegion,
}) {
  const [currentUser, setCurrentUser] = useContext(CurrentUserContext);
  const history = useHistory();
  let allRegions = ['NA', 'EUW', 'EUNE', 'LAN'];

  const BOOTCAMP_LOL_SRC =
    "data:image/svg+xml,%3C!-- Generator: Adobe Illustrator 22.1.0, SVG Export Plug-In --%3E%3Csvg version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' xmlns:a='http://ns.adobe.com/AdobeSVGViewerExtensions/3.0/' x='0px' y='0px' width='243.7px' height='72.4px' viewBox='0 0 243.7 72.4' style='enable-background:new 0 0 243.7 72.4;' xml:space='preserve'%3E%3Cstyle type='text/css'%3E .st0%7Bfill:%23C8C8C8;%7D .st1%7Bfill:%23C8AF64;%7D .st2%7Bclip-path:url(%23SVGID_2_);fill:%23141414;%7D .st3%7Bclip-path:url(%23SVGID_2_);fill:url(%23SVGID_3_);%7D .st4%7Bclip-path:url(%23SVGID_2_);fill:url(%23SVGID_4_);%7D .st5%7Bclip-path:url(%23SVGID_2_);fill:url(%23SVGID_5_);%7D .st6%7Bclip-path:url(%23SVGID_2_);fill:url(%23SVGID_6_);%7D .st7%7Bclip-path:url(%23SVGID_2_);%7D .st8%7Bfill:none;stroke:url(%23SVGID_7_);stroke-width:0.4545;stroke-miterlimit:10;%7D .st9%7Bfill:none;stroke:url(%23SVGID_8_);stroke-width:0.4545;stroke-miterlimit:10;%7D .st10%7Bfill:none;stroke:url(%23SVGID_9_);stroke-width:1.4545;stroke-miterlimit:10;%7D .st11%7Bfill:none;stroke:url(%23SVGID_10_);stroke-width:0.6364;stroke-miterlimit:10;%7D .st12%7Bfill:url(%23SVGID_11_);%7D .st13%7Bfill:none;stroke:url(%23SVGID_12_);stroke-width:0.2286;stroke-miterlimit:10;%7D .st14%7Bfill:none;stroke:url(%23SVGID_13_);stroke-width:0.2286;stroke-miterlimit:10;%7D .st15%7Bfill:url(%23SVGID_14_);%7D .st16%7Bfill:url(%23SVGID_15_);%7D .st17%7Bfill:none;stroke:url(%23SVGID_16_);stroke-width:0.2286;stroke-miterlimit:10;%7D .st18%7Bfill:none;stroke:url(%23SVGID_17_);stroke-width:0.2286;stroke-miterlimit:10;%7D .st19%7Bfill:url(%23SVGID_18_);%7D .st20%7Bfill:url(%23SVGID_19_);%7D .st21%7Bclip-path:url(%23SVGID_21_);fill:%23141414;%7D .st22%7Bclip-path:url(%23SVGID_21_);fill:url(%23SVGID_22_);%7D .st23%7Bclip-path:url(%23SVGID_21_);fill:url(%23SVGID_23_);%7D .st24%7Bclip-path:url(%23SVGID_21_);fill:url(%23SVGID_24_);%7D .st25%7Bclip-path:url(%23SVGID_21_);fill:url(%23SVGID_25_);%7D .st26%7Bclip-path:url(%23SVGID_21_);%7D .st27%7Bfill:none;stroke:url(%23SVGID_26_);stroke-width:0.4545;stroke-miterlimit:10;%7D .st28%7Bfill:none;stroke:url(%23SVGID_27_);stroke-width:0.4545;stroke-miterlimit:10;%7D .st29%7Bfill:none;stroke:url(%23SVGID_28_);stroke-width:1.4545;stroke-miterlimit:10;%7D .st30%7Bfill:none;stroke:url(%23SVGID_29_);stroke-width:0.6364;stroke-miterlimit:10;%7D .st31%7Bfill:url(%23SVGID_30_);%7D .st32%7Bfill:none;stroke:url(%23SVGID_31_);stroke-width:0.2286;stroke-miterlimit:10;%7D .st33%7Bfill:none;stroke:url(%23SVGID_32_);stroke-width:0.2286;stroke-miterlimit:10;%7D .st34%7Bfill:url(%23SVGID_33_);%7D .st35%7Bfill:url(%23SVGID_34_);%7D .st36%7Bfill:none;stroke:url(%23SVGID_35_);stroke-width:0.2286;stroke-miterlimit:10;%7D .st37%7Bfill:none;stroke:url(%23SVGID_36_);stroke-width:0.2286;stroke-miterlimit:10;%7D .st38%7Bfill:url(%23SVGID_37_);%7D .st39%7Bfill:url(%23SVGID_38_);%7D%0A%3C/style%3E%3Cdefs%3E%3C/defs%3E%3Cg%3E%3Cpath class='st0' d='M78.7,44.7h-6.5V29.8H78c1,0,1.9,0.1,2.6,0.4c0.7,0.2,1.3,0.6,1.6,1c0.7,0.8,1,1.6,1,2.6c0,1.2-0.4,2-1.1,2.6 c-0.3,0.2-0.4,0.3-0.5,0.4c-0.1,0.1-0.3,0.1-0.5,0.2c0.9,0.2,1.7,0.6,2.2,1.2c0.5,0.6,0.8,1.4,0.8,2.4s-0.4,1.9-1.1,2.7 C82.2,44.2,80.8,44.7,78.7,44.7z M75.5,35.8h1.6c0.9,0,1.6-0.1,2.1-0.3c0.4-0.2,0.7-0.6,0.7-1.3c0-0.7-0.2-1.1-0.6-1.3 s-1.1-0.3-2.1-0.3h-1.6L75.5,35.8L75.5,35.8z M75.5,41.9h2.3c0.9,0,1.7-0.1,2.1-0.4c0.5-0.2,0.7-0.7,0.7-1.4c0-0.7-0.3-1.1-0.8-1.4 c-0.5-0.2-1.3-0.3-2.4-0.3h-2v3.5H75.5z'/%3E%3Cpath class='st0' d='M99.2,42.6c-1.5,1.5-3.4,2.2-5.6,2.2s-4-0.7-5.5-2.2s-2.3-3.3-2.3-5.5s0.8-4,2.3-5.5c1.5-1.5,3.4-2.2,5.5-2.2 c2.2,0,4,0.7,5.6,2.2c1.5,1.5,2.3,3.3,2.3,5.5C101.4,39.3,100.7,41.2,99.2,42.6z M98.1,37.2c0-1.3-0.4-2.5-1.3-3.4 c-0.9-0.9-1.9-1.4-3.1-1.4s-2.3,0.4-3.2,1.4c-0.8,0.9-1.3,2-1.3,3.4c0,1.3,0.4,2.5,1.3,3.4c0.9,0.9,1.9,1.4,3.1,1.4 s2.3-0.5,3.1-1.4C97.5,39.7,98.1,38.5,98.1,37.2z'/%3E%3Cpath class='st0' d='M116.7,42.6c-1.5,1.5-3.4,2.2-5.6,2.2s-4-0.7-5.5-2.2s-2.3-3.3-2.3-5.5s0.8-4,2.3-5.5c1.5-1.5,3.4-2.2,5.5-2.2 c2.2,0,4,0.7,5.6,2.2c1.5,1.5,2.3,3.3,2.3,5.5C118.9,39.3,118.2,41.2,116.7,42.6z M115.6,37.2c0-1.3-0.4-2.5-1.3-3.4 c-0.9-0.9-1.9-1.4-3.1-1.4s-2.3,0.4-3.2,1.4c-0.9,0.9-1.3,2.1-1.3,3.4s0.4,2.5,1.3,3.4c0.9,0.9,1.9,1.4,3.1,1.4s2.3-0.5,3.1-1.4 C115,39.7,115.6,38.5,115.6,37.2z'/%3E%3Cpath class='st0' d='M127.6,32.7v12h-3.3v-12h-4.2v-2.9h11.7v2.9H127.6z'/%3E%3Cpath class='st0' d='M140.6,41.7c1.6,0,3-0.6,4-1.9l2.1,2.2c-1.7,1.9-3.7,2.8-6,2.8s-4.2-0.7-5.7-2.2s-2.2-3.3-2.2-5.5 s0.8-4,2.3-5.5c1.5-1.5,3.4-2.2,5.5-2.2c2.4,0,4.5,0.9,6.1,2.8l-2.1,2.3c-1-1.3-2.4-2-3.9-2c-1.2,0-2.3,0.4-3.2,1.2 c-0.9,0.8-1.3,1.9-1.3,3.3c0,1.4,0.4,2.5,1.3,3.3C138.4,41.3,139.4,41.7,140.6,41.7z'/%3E%3Cpath class='st0' d='M160,44.7l-1.4-3.2h-6.2l-1.4,3.2h-3.5l6.4-14.9h3.2l6.4,14.9H160z M155.5,34.2l-1.9,4.3h3.7L155.5,34.2z'/%3E%3Cpath class='st0' d='M178.6,35.3l-4,8.1h-2l-4-8.1v9.4h-3.3V29.8h4.5l3.8,8.2l3.8-8.2h4.5v14.9h-3.3V35.3z'/%3E%3Cpath class='st0' d='M195.8,31.1c1,0.9,1.6,2.2,1.6,4.1c0,1.9-0.5,3.2-1.6,4c-1.1,0.9-2.7,1.3-4.9,1.3h-2v4.1h-3.3V29.8h5.3 C193.1,29.8,194.7,30.3,195.8,31.1z M193.4,37c0.4-0.4,0.6-1.1,0.6-2c0-0.9-0.3-1.5-0.8-1.8s-1.3-0.5-2.4-0.5h-1.9v5h2.2 C192.2,37.7,193,37.4,193.4,37z'/%3E%3C/g%3E%3Cg%3E%3Cpath class='st1' d='M199.2,44.4c-0.2-0.2-0.3-0.5-0.3-0.8s0.1-0.6,0.3-0.8c0.2-0.2,0.5-0.3,0.8-0.3s0.6,0.1,0.8,0.3 c0.2,0.2,0.3,0.5,0.3,0.8s-0.1,0.6-0.3,0.8s-0.5,0.3-0.8,0.3S199.4,44.7,199.2,44.4z'/%3E%3Cpath class='st1' d='M204.6,29.8h1.6v13.5h8.3v1.4h-9.9L204.6,29.8L204.6,29.8z'/%3E%3Cpath class='st1' d='M218.8,43.8c-1.2-0.7-2.1-1.6-2.8-2.7c-0.7-1.1-1-2.4-1-3.9s0.3-2.7,1-3.9c0.7-1.1,1.6-2.1,2.8-2.7 c1.2-0.7,2.5-1,4-1s2.8,0.3,4,1c1.2,0.7,2.1,1.6,2.8,2.7c0.7,1.1,1,2.4,1,3.9s-0.3,2.7-1,3.9c-0.7,1.2-1.6,2.1-2.8,2.7 c-1.2,0.6-2.5,1-4,1S220,44.5,218.8,43.8z M226,42.6c0.9-0.5,1.7-1.3,2.2-2.2c0.5-0.9,0.8-2,0.8-3.2s-0.3-2.2-0.8-3.2 c-0.5-0.9-1.3-1.7-2.2-2.2c-1-0.5-2-0.8-3.2-0.8s-2.2,0.3-3.2,0.8c-1,0.5-1.7,1.3-2.3,2.2c-0.5,0.9-0.8,2-0.8,3.2s0.3,2.2,0.8,3.2 c0.5,0.9,1.3,1.7,2.3,2.2s2,0.8,3.2,0.8S225,43.1,226,42.6z'/%3E%3Cpath class='st1' d='M233.8,29.8h1.6v13.5h8.3v1.4h-9.9L233.8,29.8L233.8,29.8z'/%3E%3C/g%3E%3Cg%3E%3Cg%3E%3Cdefs%3E%3Ccircle id='SVGID_1_' cx='31.2' cy='34.7' r='22'/%3E%3C/defs%3E%3CclipPath id='SVGID_2_'%3E%3Cuse xlink:href='%23SVGID_1_' style='overflow:visible;'/%3E%3C/clipPath%3E%3Crect x='3.8' y='6.4' class='st2' width='55.2' height='55.3'/%3E%3ClinearGradient id='SVGID_3_' gradientUnits='userSpaceOnUse' x1='33.2951' y1='18.9967' x2='33.2951' y2='56.5739'%3E%3Cstop offset='0' style='stop-color:%23000000'/%3E%3Cstop offset='1' style='stop-color:%23141414'/%3E%3C/linearGradient%3E%3Cpolygon class='st3' points='42.3,8.3 6.5,48.6 60.1,24.4 '/%3E%3ClinearGradient id='SVGID_4_' gradientUnits='userSpaceOnUse' x1='30.2619' y1='18.9967' x2='30.2619' y2='56.5739'%3E%3Cstop offset='0' style='stop-color:%23000000'/%3E%3Cstop offset='1' style='stop-color:%23141414'/%3E%3C/linearGradient%3E%3Cpolygon class='st4' points='57.2,48.4 3.3,48.7 57.1,72.4 '/%3E%3ClinearGradient id='SVGID_5_' gradientUnits='userSpaceOnUse' x1='21.5273' y1='18.9967' x2='21.5273' y2='56.5739'%3E%3Cstop offset='0' style='stop-color:%23000000'/%3E%3Cstop offset='1' style='stop-color:%23141414'/%3E%3C/linearGradient%3E%3Cpolygon class='st5' points='17.2,0 0,58.3 43.1,7.9 '/%3E%3ClinearGradient id='SVGID_6_' gradientUnits='userSpaceOnUse' x1='33.8405' y1='18.9967' x2='33.8405' y2='56.5739'%3E%3Cstop offset='0' style='stop-color:%23000000'/%3E%3Cstop offset='0.1286' style='stop-color:%23030303'/%3E%3Cstop offset='1' style='stop-color:%23141414'/%3E%3C/linearGradient%3E%3Cpolygon class='st6' points='56.1,25.6 0.7,50.7 67,50.4 '/%3E%3Cg class='st7'%3E%3ClinearGradient id='SVGID_7_' gradientUnits='userSpaceOnUse' x1='11.5325' y1='34.8447' x2='21.931' y2='34.8447'%3E%3Cstop offset='0' style='stop-color:%2359492F'/%3E%3Cstop offset='0.3156' style='stop-color:%23C2B066'/%3E%3Cstop offset='0.6397' style='stop-color:%2365582E'/%3E%3Cstop offset='1' style='stop-color:%23574223'/%3E%3C/linearGradient%3E%3Cpath class='st8' d='M21.7,53.5v-1.7c-5.9-3.3-9.9-9.7-9.9-17c0-7.2,3.9-13.4,9.6-16.8v-1.7'/%3E%3ClinearGradient id='SVGID_8_' gradientUnits='userSpaceOnUse' x1='40.5999' y1='34.8447' x2='50.9984' y2='34.8447'%3E%3Cstop offset='0' style='stop-color:%2359492F'/%3E%3Cstop offset='0.3156' style='stop-color:%23C2B066'/%3E%3Cstop offset='0.6397' style='stop-color:%2365582E'/%3E%3Cstop offset='1' style='stop-color:%23574223'/%3E%3C/linearGradient%3E%3Cpath class='st9' d='M40.8,53.5v-1.7c5.9-3.3,9.9-9.7,9.9-17c0-7.2-3.9-13.4-9.6-16.8v-1.7'/%3E%3C/g%3E%3C/g%3E%3ClinearGradient id='SVGID_9_' gradientUnits='userSpaceOnUse' x1='8.4769' y1='34.7457' x2='53.9315' y2='34.7457'%3E%3Cstop offset='0' style='stop-color:%2359492F'/%3E%3Cstop offset='0.3156' style='stop-color:%23C2B066'/%3E%3Cstop offset='0.6397' style='stop-color:%2365582E'/%3E%3Cstop offset='1' style='stop-color:%23574223'/%3E%3C/linearGradient%3E%3Ccircle class='st10' cx='31.2' cy='34.7' r='22'/%3E%3ClinearGradient id='SVGID_10_' gradientUnits='userSpaceOnUse' x1='31.2042' y1='13.1548' x2='31.2042' y2='56.3366'%3E%3Cstop offset='0' style='stop-color:%2359492F'/%3E%3Cstop offset='0.3156' style='stop-color:%23C2B066'/%3E%3Cstop offset='0.6397' style='stop-color:%2365582E'/%3E%3Cstop offset='1' style='stop-color:%23574223'/%3E%3C/linearGradient%3E%3Ccircle class='st11' cx='31.2' cy='34.7' r='21.3'/%3E%3Cg%3E%3ClinearGradient id='SVGID_11_' gradientUnits='userSpaceOnUse' x1='17.2985' y1='21.9244' x2='44.761' y2='46.2564'%3E%3Cstop offset='0' style='stop-color:%2359492F'/%3E%3Cstop offset='0.3156' style='stop-color:%23C2B066'/%3E%3Cstop offset='0.6397' style='stop-color:%2365582E'/%3E%3Cstop offset='1' style='stop-color:%23574223'/%3E%3C/linearGradient%3E%3Cpath class='st12' d='M35.7,39.4h-2.5l3.9-2.4l0.7,1.2l0.8-3.4l-7.5,4.6L23.7,35l0.8,3.4l0.7-1.2l3.9,2.4h-2.5l-3,5.5l-3-11.9 l-0.9-0.6l-1.2-4.5l4,2.4l0.2,1.1l4.1,2.5l2.9-5.1L29.2,28l2-3.5l2,3.6l-0.5,0.7l2.9,5.1l4.1-2.5l0.2-1.1l4-2.4l-1.2,4.5l-0.9,0.6 l-3,11.8L35.7,39.4z M31.2,36.5l2.2-1.3l-2.2-3.9L29,35.2L31.2,36.5z'/%3E%3C/g%3E%3Cg%3E%3ClinearGradient id='SVGID_12_' gradientUnits='userSpaceOnUse' x1='1070.8972' y1='-209.5452' x2='1070.8972' y2='-206.1026' gradientTransform='matrix(-0.7071 0.7071 -0.7071 -0.7071 641.4635 -889.6621)'%3E%3Cstop offset='0' style='stop-color:%2359492F'/%3E%3Cstop offset='0.3156' style='stop-color:%23C2B066'/%3E%3Cstop offset='0.6397' style='stop-color:%2365582E'/%3E%3Cstop offset='1' style='stop-color:%23574223'/%3E%3C/linearGradient%3E%3Crect x='29.6' y='12.9' transform='matrix(-0.7071 0.7071 -0.7071 -0.7071 63.4995 2.7582)' class='st13' width='3.2' height='3.2'/%3E%3ClinearGradient id='SVGID_13_' gradientUnits='userSpaceOnUse' x1='1070.9093' y1='-209.1166' x2='1070.9093' y2='-206.5312' gradientTransform='matrix(-0.7071 0.7071 -0.7071 -0.7071 641.4635 -889.6621)'%3E%3Cstop offset='0' style='stop-color:%2359492F'/%3E%3Cstop offset='0.3156' style='stop-color:%23C2B066'/%3E%3Cstop offset='0.6397' style='stop-color:%2365582E'/%3E%3Cstop offset='1' style='stop-color:%23574223'/%3E%3C/linearGradient%3E%3Crect x='30' y='13.4' transform='matrix(-0.7071 0.7071 -0.7071 -0.7071 63.491 2.7787)' class='st14' width='2.4' height='2.4'/%3E%3Cg%3E%3ClinearGradient id='SVGID_14_' gradientUnits='userSpaceOnUse' x1='31.17' y1='15.8146' x2='31.17' y2='12.9042'%3E%3Cstop offset='0' style='stop-color:%230083FF'/%3E%3Cstop offset='0.5817' style='stop-color:%2300AAFF'/%3E%3Cstop offset='1' style='stop-color:%2300C2FF'/%3E%3C/linearGradient%3E%3Cpolygon class='st15' points='29.7,14.5 31.2,13.1 32.6,14.5 31.2,16 '/%3E%3ClinearGradient id='SVGID_15_' gradientUnits='userSpaceOnUse' x1='30.8556' y1='14.7034' x2='31.8244' y2='13.2501'%3E%3Cstop offset='0' style='stop-color:%23FFFFFF'/%3E%3Cstop offset='1' style='stop-color:%23FFFFFF;stop-opacity:0'/%3E%3C/linearGradient%3E%3Cpath class='st16' d='M29.8,14.4c0.8-0.3,1.7-0.3,2.5-0.2l-1.2-1.2L29.8,14.4z'/%3E%3C/g%3E%3C/g%3E%3Cg%3E%3ClinearGradient id='SVGID_16_' gradientUnits='userSpaceOnUse' x1='1099.5671' y1='-238.2152' x2='1099.5671' y2='-234.7725' gradientTransform='matrix(-0.7071 0.7071 -0.7071 -0.7071 641.4635 -889.6621)'%3E%3Cstop offset='0' style='stop-color:%2359492F'/%3E%3Cstop offset='0.3156' style='stop-color:%23C2B066'/%3E%3Cstop offset='0.6397' style='stop-color:%2365582E'/%3E%3Cstop offset='1' style='stop-color:%23574223'/%3E%3C/linearGradient%3E%3Crect x='29.6' y='53.5' transform='matrix(-0.7071 0.7071 -0.7071 -0.7071 92.1694 71.9736)' class='st17' width='3.2' height='3.2'/%3E%3ClinearGradient id='SVGID_17_' gradientUnits='userSpaceOnUse' x1='1099.5792' y1='-237.7866' x2='1099.5792' y2='-235.2012' gradientTransform='matrix(-0.7071 0.7071 -0.7071 -0.7071 641.4635 -889.6621)'%3E%3Cstop offset='0' style='stop-color:%2359492F'/%3E%3Cstop offset='0.3156' style='stop-color:%23C2B066'/%3E%3Cstop offset='0.6397' style='stop-color:%2365582E'/%3E%3Cstop offset='1' style='stop-color:%23574223'/%3E%3C/linearGradient%3E%3Crect x='30' y='53.9' transform='matrix(-0.7071 0.7071 -0.7071 -0.7071 92.1609 71.9942)' class='st18' width='2.4' height='2.4'/%3E%3Cg%3E%3ClinearGradient id='SVGID_18_' gradientUnits='userSpaceOnUse' x1='31.17' y1='56.3601' x2='31.17' y2='53.4497'%3E%3Cstop offset='0' style='stop-color:%230083FF'/%3E%3Cstop offset='0.5817' style='stop-color:%2300AAFF'/%3E%3Cstop offset='1' style='stop-color:%2300C2FF'/%3E%3C/linearGradient%3E%3Cpolygon class='st19' points='29.7,55.1 31.2,53.6 32.6,55.1 31.2,56.5 '/%3E%3ClinearGradient id='SVGID_19_' gradientUnits='userSpaceOnUse' x1='30.8556' y1='55.2488' x2='31.8244' y2='53.7955'%3E%3Cstop offset='0' style='stop-color:%23FFFFFF'/%3E%3Cstop offset='1' style='stop-color:%23FFFFFF;stop-opacity:0'/%3E%3C/linearGradient%3E%3Cpath class='st20' d='M29.8,55c0.8-0.3,1.7-0.3,2.5-0.2l-1.2-1.2L29.8,55z'/%3E%3C/g%3E%3C/g%3E%3C/g%3E%3C/svg%3E%0A";

  let selectRegions = [
    currentUser?.region,
    ...allRegions.filter((r) => r !== currentUser?.region),
  ];

  return (
    <div className="page-section site-header">
      <div className="inner-column">
        <div className="d-flex align-center justify-between">
          <div className="logo d-flex align-center">
            <img
              src={BOOTCAMP_LOL_SRC}
              alt="logo"
              style={{ marginRight: '10px' }}
            />
            &nbsp;
            <h1>Scrims finder</h1>
          </div>

          <div className="d-flex mr-3">
            <Button
              onClick={() => {
                history.push('./user-setup');
                setCurrentUser(null);
              }}
              variant="contained"
              color="secondary">
              Log Out
            </Button>
          </div>
        </div>
        <br />
        <div className="d-flex align-center justify-between">
          <div>
            <h2>Welcome: {currentUser?.name}</h2>
          </div>

          <div>
            <InputLabel className="text-white">Region</InputLabel>

            <Select
              value={scrimsRegion}
              className="text-white"
              onChange={(e) => {
                const region = e.target.value;
                toggleFetch((prev) => !prev);
                setScrimsRegion(region);
                onSelectRegion(region);
              }}>
              {selectRegions.map((region, key) => (
                <MenuItem value={region} key={key}>
                  {region}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText className="text-white">
              Filter scrims by region
            </FormHelperText>
          </div>
        </div>
      </div>
    </div>
  );
}
