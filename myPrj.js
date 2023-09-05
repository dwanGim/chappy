const data = [];
const $textarea = document.querySelector('textarea');

const url = `https://estsoft-openai-api.jejucodingcamp.workers.dev/`;

const tabBtns = document.querySelectorAll('.tabBtn');
const nextBtn = document.getElementById('nextBtn');
const prevBtn = document.getElementById('prevBtn');
const TOTAL_PAGE = document.querySelectorAll('.field-container fieldset').length;
let CURRENT_PAGE = 1;
let isReplying = false;

const speechBubbleStr = ["힘세고 강한 아침! 묻겠다면, 내 이름은 채피. 우리는  쓴다. AI로 웹소설을", "어떤 장르를 쓰고 싶으세요?", "주인공에 대해 알려주세요.", "조력자는 어떤 인물인가요?", "빌런에 대해 궁금해요!", "이야기의 배경은? ", "주인공에게 무슨 일이 생기나요?", "그 다음엔 어떤 사건을 겪게 되나요?", "그 다음엔 어떻게 되는 거죠??", "이야기의 결말은 어떻게 되나요?","멋진 이야기를 만들기 위해 채피에게 이 이야기만의 멋진 점을 꼭 가르쳐주세요!", "아직 결과가 없습니다!"];
const replyingSpeechBubble = ["제목입니다!","장르입니다!","주인공입니다!","조력자입니다!","빌런입니다!","이야기의 배경입니다!","첫번째 사건입니다!","두번째 사건입니다!","세번째 사건입니다!","엔딩입니다!","이 작품의 주제와 설명입니다.","웹소설이 완성되었습니다!"];
const textareaIdList = ["title","genre","mc","sc","antagonist","background","event1","event2","event3","ending","moral","output"];
const outputStrList = ["[제목]","[장르]","[주인공]","[조력자]","[빌런]","[배경]","[첫 사건]","[두번째 사건]","[세번째 사건]","[엔딩]","[덧붙여서..]"];


// 초기화 함수들은 여기에!
document.addEventListener('DOMContentLoaded', function () {
    // 문서가 로드될 때 실행할 코드
    console.log("채피, 발진");
    console.log("TOTAL_PAGES"+TOTAL_PAGE);
    console.log(tabBtns)

    goAheadCat(CURRENT_PAGE); // 고양아 말해
    
    moveToPage(1);
    tabBtns[0].classList.add('clicked');
    // setupTextareaBehavior("tabBtn1");
    data.push({
        "role": "system",
        "content": "assistant는 한국어로 웹소설을 만들어주는 최고의 AI입니다. 최고의 AI답게 제목이랑 등장인물 이름을 멋있게 지어주지요. 스토리도 물론 흥미진진합니다!"
    });
});

function moveToPage(pageNumber) {
    console.log("pageNumber"+pageNumber);
    console.log("CURRENT_PAGE"+CURRENT_PAGE);
    const currentField = document.getElementById(`question${CURRENT_PAGE}`);
    const targetField = document.getElementById(`question${pageNumber}`);
    const nextBtn = document.getElementById('nextBtn');
    const prevBtn = document.getElementById('prevBtn');
    const idunnoBtn = document.getElementById('iDunnoBtn');

    currentField.style.display = 'none';
    targetField.style.display = 'block';

 

    if(pageNumber == 1) {
        console.log("첫번째 페이지야");
        prevBtn.disabled = true;
    }
    else{
        prevBtn.disabled = false;
    }

    if(CURRENT_PAGE < TOTAL_PAGE) {
        console.log("현재 페이지가 마지막 페이지가 아니야");
        nextBtn.disabled = false;
        idunnoBtn.disabled = false;
        
    }
    if(pageNumber == TOTAL_PAGE || pageNumber > TOTAL_PAGE){
        console.log("현재 페이지가 마지막 페이지야");
        nextBtn.disabled = true;
        idunnoBtn.disabled = true;
        if(isReplying){
            idunnoBtn.disabled = false;
            displayOutPut();
            // goAheadCat(speechBubbleStr.length);
        }else{
            nonDisplayOutPut();
        }
    }

    CURRENT_PAGE = pageNumber;
    goAheadCat(CURRENT_PAGE);

    const tabIdToClick = `tabBtn${CURRENT_PAGE}`;
    document.getElementById(tabIdToClick).click();

}

tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const btnId = btn.id;
        const textareaIndex = parseInt(btnId.replace('tabBtn', '')) - 1; // 버튼의 ID로 textarea의 인덱스 계산
        const textareaId = textareaIdList[textareaIndex]; // textareaIdList에서 textarea의 ID 가져오기
        const textareaTxt = document.getElementById(textareaId); // 해당 ID에 해당하는 textarea 요소 선택
        const idunnoBtn = document.getElementById("iDunnoBtn");
        // 버튼의 기본 텍스트를 저장합니다.
        const idunno = "모르겠어요..";
        moveToPage(textareaIndex+1);
        idunnoBtn.textContent = idunno;
        idunnoBtn.style.backgroundColor = '';

        // textarea에 대한 이벤트 리스너 등록
        textareaTxt.addEventListener('input', () => {
            // textarea의 내용이 변경되었을 때 실행할 작업
            console.log(`Textarea with ID ${textareaId} 내용이 변경되었습니다.`);
            if (textareaTxt.value.length > 0) {
                idunnoBtn.textContent = '이걸로 합시다!';
                idunnoBtn.style.backgroundColor = '#abd0bc';
                
            } else {
                idunnoBtn.textContent = idunno;
                idunnoBtn.style.backgroundColor = '';
            }
        }); 
        // 클릭된 버튼에 'clicked' 클래스를 추가합니다.
        btn.classList.add('clicked');
        // 다른 버튼들에서 'clicked' 클래스를 제거합니다.
        tabBtns.forEach(otherBtn => {
            if (otherBtn !== btn) {
                otherBtn.classList.remove('clicked');
            }
        });

        // 클릭된 버튼에 대한 동작을 여기에 작성합니다.
        console.log(`${btn.textContent} 버튼이 클릭되었습니다.`);
        
        if (textareaTxt.value) {
            idunnoBtn.textContent = (textareaTxt.value.length != 0) ? '이걸로 합시다!' : idunno;
            idunnoBtn.style.backgroundColor = (textareaTxt.value.length != 0) ? '#abd0bc' : ''; // 배경색을 빈 문자열로 설정하여 제거
        }
        
    });

  
});

function goAheadCat(num) {
    let theCatSays;
    if(!isReplying){
        const catSaysIndex = num-1;
        theCatSays = speechBubbleStr[catSaysIndex];
    }else{
        const catSaysIndex = num-1;
        theCatSays = replyingSpeechBubble[catSaysIndex];
    }
    document.getElementById('catSay').innerText = theCatSays;
}



function iDunno(){
    console.log(isReplying);

    if(isReplying){
        const output = document.getElementById('output').innerText;
        navigator.clipboard.writeText(output)
        .then(() => {
            alert('텍스트가 복사되었습니다.');
        })
        .catch(err => {
            console.error('텍스트 복사 실패: ', err);
        });
    }else{
        const NEXT_PAGE = CURRENT_PAGE+1;
        moveToPage(NEXT_PAGE);
    }
}


// script.js
function generateWebNovel() {

    moveToPage(TOTAL_PAGE);
    // goAheadCat(speechBubbleStr.length-1);
 
    const title = "[제목]" + document.getElementById('title').value || "[제목]";
    const genre = "[장르]"+document.getElementById('genre').value || "[장르]";
    const mc = "[주인공]"+document.getElementById('mc').value || "[주인공]";
    const sc = "[조력자]"+document.getElementById('sc').value || "[조력자]";
    const antagonist = "[빌런]"+document.getElementById('antagonist').value || "[빌런]";
    const background = "[배경]"+document.getElementById('background').value || "[배경]";
    const event1 = "[첫 사건]"+document.getElementById('event1').value || "[첫 사건]";
    const event2 = "[두번째 사건]"+document.getElementById('event2').value || "[두번째 사건]";
    const event3 = "[세번째 사건]"+document.getElementById('event3').value || "[세번째 사건]";
    const ending = "[엔딩]"+document.getElementById('ending').value || "[엔딩]";
    const moral = "[덧붙여서..]"+document.getElementById('moral').value || "[덧붙여서..]";
    
    const output = `
        ${title}
        <br>
        ${genre}
        <br>
        ${mc}
        <br>
        ${sc}
        <br>
        ${antagonist}
        <br>
        ${background}
        <br>
        ${event1}
        <br>
        ${event2}
        <br>
        ${event3}
        <br>
        ${ending}
        <br>
        ${moral}
        <br>
    `;

    data.push({
        "role": "user",
        "content": output
    });
    $textarea.value = '';
    console.log(output);
    chatGPTAPI();
    document.getElementById('iDunnoBtn').disabled = false;
}

function chatGPTAPI() {
    const loading = document.getElementById('loading');
    const outputArea = document.getElementById('outputArea');
    const outputDiv = document.getElementById('output');

    outputDiv.style.display = "block";
    loading.style.display = "block";
    outputArea.style.display = "none";

    document.getElementById('catSay').innerText = "로딩 중..."

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
        redirect: 'follow'
    })
    .then(res => res.json())
    .then(res => {
        console.log(res);
        // 답변 온 것을 assistant로 저장
        const replying = res.choices[0].message.content;
        outputDiv.innerHTML = `<p class='typingTxt' style='white-space: pre-line;'>${replying}</p>`
        loading.style.display = "none";
        console.log(replying);
        // 지금은 문제가 많은 타이핑 함수
        // autoTyping(".typingTxt",200);
        displayOutPut();
        outputToTextarea(replying);
        isReplying = true;
        goAheadCat(CURRENT_PAGE);
    })
}

function displayOutPut(){
    document.getElementById('question11').style.display = "none";
    document.getElementById('question12').style.display = "block";
    const output = document.getElementById('output');
    const iDunnoBtn = document.getElementById('iDunnoBtn');
    output.style.display = "block";
    iDunnoBtn.textContent = "복사하기";
    iDunnoBtn.style.backgroundColor = '#93dbe9';
    
}

function nonDisplayOutPut(){
    document.getElementById('output').style.display = "none";
    const htmlSet = "\n&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp";
    const title = "[제목]" +htmlSet+ document.getElementById('title').value || "[제목]"+htmlSet;
    const genre = "[장르]"+htmlSet+document.getElementById('genre').value || "[장르]";
    const mc = "[주인공]"+htmlSet+document.getElementById('mc').value || "[주인공]"+htmlSet;
    const sc = "[조력자]"+htmlSet+document.getElementById('sc').value || "[조력자]"+htmlSet;
    const antagonist = "[빌런]"+htmlSet+document.getElementById('antagonist').value || "[빌런]"+htmlSet;
    const background = "[배경]"+htmlSet+document.getElementById('background').value || "[배경]"+htmlSet;
    const event1 = "[첫 사건]"+htmlSet+document.getElementById('event1').value || "[첫 사건]"+htmlSet;
    const event2 = "[두번째 사건]"+htmlSet+document.getElementById('event2').value || "[두번째 사건]"+htmlSet;
    const event3 = "[세번째 사건]"+htmlSet+document.getElementById('event3').value || "[세번째 사건]"+htmlSet;
    const ending = "[엔딩]"+htmlSet+document.getElementById('ending').value || "[엔딩]"+htmlSet;
    const moral = "[덧붙여서..]"+htmlSet+document.getElementById('moral').value || "[덧붙여서..]"+htmlSet;
    
    const output = `
        ${title}

        ${genre}

        ${mc}

        ${sc}

        ${antagonist}

        ${background}

        ${event1}

        ${event2}

        ${event3}

        ${ending}

        ${moral}
 
    `;
    document.getElementById('outputArea').innerHTML = output;


}

function autoTyping(elementClass, typingSpeed) {
    let thisTxt = $(elementClass);
    thisTxt.prepend('<div class="cursor" style="right:initial; left:0;"></div>');
    thisTxt = thisTxt.find(".typingTxt");
    let typingTxt = thisTxt.text().trim().split('');
    let lenOfTxt = typingTxt.length;
    let newTxt = "";

    thisTxt.text("|");
    setTimeout(function(){
        thisTxt.css("opacity",1);
        thisTxt.prev().removeAttr("style");
        thisTxt.text("");

        for(let i=0; i < lenOfTxt; i++){
            (function(i,char){
                setTimeout(function(){
                    newTxt += char;
                    thisTxt.text(newTxt);
                }, i*typingSpeed);
            })(i+1, text[i]);
        }
    }, 1500);
}


function outputToTextarea(output) {
    
    for (let index = 0; index < textareaIdList.length; index++) {
        const textareaId = textareaIdList[index];
        if (textareaId == "output") {
            break; // 원하는 조건을 만족하면 루프를 중단합니다.
        }
        const startMarker = outputStrList[index];
        const endMarker = outputStrList[index + 1];
        const slicedText = sliceText(output, startMarker, endMarker);
        document.getElementById(textareaId).value = slicedText;

    }
}

function sliceText(inputText, startMarker, endMarker) {
    const startIndex = inputText.indexOf(startMarker);
    const endIndex = inputText.indexOf(endMarker);
    return inputText.slice(startIndex, endIndex).trim();
  }

  function headerBtnOnClick() {
    window.location.href = "#";
}