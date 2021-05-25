(1) 請問下列程式執行後的結果為何？為什麼？

console.log("start");

(function () {
  console.log("IIFE");
  setTimeout(function () {
    console.log("Timeout");
  }, 1000);
})();

console.log("end");

A:    start
      IIFE
      end
      Timeout

因為console.log("Timeout");該function
有給予setTimeout延遲一秒，
所以將setTimeout丟給瀏覽器去執行延遲一秒的動作，
並移除在stack中的function
而繼續執行end,而setTimeout在等候完延遲時間後
將由事件循環把setTimeout內的function丟給任務佇列中去進行排隊，
當他發現現階段的stack中沒有東西時
會被佇列丟回stack中執行，所以執行結果為上。


(2) 請問下列程式執行的結果為何？為什麼？

console.log("start");

(function () {
    console.log("IIFE");
    setTimeout(function () {
      console.log("Timeout");
    }, 0);
  })();
  
  console.log("end");

A:      start
        IIFE
        end
        Timeout
雖然設定setTimeout秒數為0，但因為setTimeout本身是瀏覽器提供的，
所以在執行程式時setTimeout這個function時
一樣會被丟到瀏覽器端，
所以程式執行一樣是先執行了start，然後執行IIFE
並將setTimeout丟給瀏覽器，接著執行end，
然後setTimeout內的function同時正在任務佇列中進行排隊，
當stack中東西執行完清空時將會被佇列丟回stack中執行，所以執行結果為上。

  


(3) 請問下列程式執行的結果為何？為什麼？
const bar = () => console.log("bar");

const baz = () => console.log("baz");

const foo = () => {
  console.log("foo");
  bar();
  baz();
};

foo();

A:    foo
      bar
      baz

因為bar baz定義了consloe.log的內容
並沒有立即呼叫他，
程式最後呼叫了foo()
並按照順序執行


(4) 請問下列程式執行的結果為何？為什麼？
const bar = () => console.log("bar");

const baz = () => console.log("baz");

const foo = () => {
  console.log("foo");
  setTimeout(bar, 0);
  baz();
};

foo();

A:  foo
    baz
    bar

在呼叫foo時按照順序執行了內部的consloe，
bar因為有設定setTimeout，即使秒數為0，
一樣會將bar丟給瀏覽器端，然後從stack上清除
並接著執行baz然後才將丟到瀏覽器端的bar
丟入任務佇列中排隊，交由事件循環去檢查stack中是否還有內容
stack清空後將bar丟回stack中執行。


