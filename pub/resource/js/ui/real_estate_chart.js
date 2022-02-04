// rMateChart 를 생성합니다.
// 파라메터 (순서대로)
// 1. 차트의 id (임의로 지정하십시오.)
// 2. 차트가 위치할 div의 id(즉, 차트의 부모 div의 id 입니다.)
// 3. 차트 생성 시 필요한 환경 변수들의 묶음인 chartVars
// 4. 차트의 가로 크기 (생략 가능, 생략시 100%)
// 5. 차트의 세로 크기 (생략 가능, 생략시 100%)
rMateChartH5.create('chart1', 'chartHolder', '', '100%', '100%');



// 스트링 형식으로 레이아웃 정의.
var layoutStr = 
    '<rMateChart backgroundColor="#ffffff" borderStyle="none">'
        // +'<Options>'
        //     +'<Caption text="Annual Report"/>'
        // +'</Options>'
        +'<Pie2DChart innerRadius="0.7" showDataTips="false" selectionMode="none">'
            +'<series>'
                +'<Pie2DSeries nameFieId="Month" field="Profit" startAngle="125" renderDirection="clockwise" labelPosition="none" color="#ffffff">'
                    +'<fills>'
                        +'<SolidColor color="#7cf0ed"/>'
                        +'<SolidColor color="#009591"/>'
                        
                        // +'<SolidColor color="#40b2e6"/>'
                    +'</fills>'
                    // +'<showDataEffect>'
                    //     +'<SeriesZoom duratoin="1000"/>'
                    // +'</showDataEffect>'
                +'</Pie2DSeries>'
            +'</series>'
            // +'<backgroundElements>'
            //     +'<CanvasElement>'
            //         +'<CanvasLabel height="24" horizontalCenter="0" verticalCenter="-10" fontSize="19" color="#333333" backgroundAlpha="0"/>'
            //         +'<CanvasLabel height="24" horizontalCenter="0" verticalCenter="-10" fontSize="14" color="#666666" backgroundAlpha="0"/>'
            //     +'</CanvasElement>'
            // +'</backgroundElements>'
        +'</Pie2DChart>'
    +'</rMateChart>';

//게이지 데이터
var chartData = [
    {"퇴직금":"40%", "Profit":40},
    {"개인적립금":"60%", "Profit":60},
    // {"month":"Feb", "Profit":40},
];




rMateChartH5.calls("chart1", {
    'setLayout': layoutStr,
    'setData': chartData,
})