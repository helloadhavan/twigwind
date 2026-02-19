  function main(twigwind) {
    function log(cls, cname) {
        console.log("Twigwind extension activated");
    }
    twigwind.addfunction(log, /activate*/);
}

if (typeof window !== 'undefined') window.main = main;
if (typeof module !== 'undefined' && module.exports) module.exports = { main };