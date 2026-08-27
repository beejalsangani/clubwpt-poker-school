(function () {
  "use strict";

  var KEY = "cwpt_poker_school_v1";
  var TOTAL_LESSONS = 9;
  var CHIPS_PER = 10000;
  var CLAIM_EMAIL = "[REDEMPTION EMAIL]";

  function load() {
    try {
      var raw = window.localStorage.getItem(KEY);
      return raw ? JSON.parse(raw) : { done: [] };
    } catch (e) {
      return { done: [] };
    }
  }
  function save(state) {
    try {
      window.localStorage.setItem(KEY, JSON.stringify(state));
    } catch (e) {}
  }
  function markDone(idx) {
    var s = load();
    if (s.done.indexOf(idx) === -1) {
      s.done.push(idx);
      save(s);
    }
    return s;
  }
  function fmt(n) {
    return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  function paintChrome() {
    var s = load();
    var count = s.done.length;
    var chips = count * CHIPS_PER;

    var bank = document.getElementById("bankNum");
    if (bank) bank.textContent = fmt(chips);

    var stack = document.getElementById("railStack");
    if (stack) {
      stack.innerHTML = "";
      for (var i = 0; i < TOTAL_LESSONS; i++) {
        var c = document.createElement("div");
        c.className = "chip" + (s.done.indexOf(i) > -1 ? " done" : "");
        c.style.transitionDelay = i * 45 + "ms";
        stack.appendChild(c);
      }
      var rc = document.getElementById("railCount");
      var rch = document.getElementById("railChips");
      if (rc) rc.textContent = count;
      if (rch) rch.textContent = fmt(chips);
    }

    var cards = document.querySelectorAll(".lesson-card");
    Array.prototype.forEach.call(cards, function (card) {
      var idx = parseInt(card.getAttribute("data-idx"), 10);
      if (s.done.indexOf(idx) > -1) {
        card.classList.add("done");
        var chip = card.querySelector(".lc-chip");
        if (chip) chip.textContent = "10,000";
      }
    });

    // Start button follows progress
    var start = document.getElementById("startBtn");
    if (start && count > 0) {
      var next = document.querySelector('.lesson-card:not(.done)');
      if (next) {
        start.textContent = "Continue the course";
        start.setAttribute("href", next.getAttribute("href"));
      } else {
        start.textContent = "Review the course";
      }
    }
  }

  window.initQuiz = function () {
    var Q = window.QUIZ;
    if (!Q) return;
    var host = document.getElementById("quizBody");
    if (!host) return;

    var i = 0;
    var score = 0;
    var answered = false;
    var LETTERS = ["A", "B", "C", "D"];

    function renderQuestion() {
      answered = false;
      var item = Q.qs[i];
      var prompt = item[0], opts = item[1], correct = item[2], why = item[3];

      host.innerHTML = "";

      var count = document.createElement("p");
      count.className = "qcount";
      count.textContent = "Question " + (i + 1) + " of " + Q.qs.length;
      host.appendChild(count);

      var qt = document.createElement("p");
      qt.className = "qtext";
      qt.textContent = prompt;
      host.appendChild(qt);

      var wrap = document.createElement("div");
      wrap.className = "opts";
      opts.forEach(function (text, j) {
        var b = document.createElement("button");
        b.className = "opt";
        b.type = "button";
        var l = document.createElement("span");
        l.className = "opt-letter";
        l.textContent = LETTERS[j];
        var t = document.createElement("span");
        t.textContent = text;
        b.appendChild(l);
        b.appendChild(t);
        b.addEventListener("click", function () {
          if (answered) return;
          answered = true;
          var all = wrap.querySelectorAll(".opt");
          Array.prototype.forEach.call(all, function (btn, k) {
            btn.disabled = true;
            if (k === correct) btn.classList.add("correct");
          });
          if (j === correct) {
            score++;
          } else {
            b.classList.add("wrong");
          }
          showWhy(j === correct, why);
        });
        wrap.appendChild(b);
      });
      host.appendChild(wrap);
    }

    function showWhy(wasRight, why) {
      var p = document.createElement("p");
      p.className = "why";
      var label = document.createElement("strong");
      label.textContent = wasRight ? "Correct. " : "Not quite. ";
      p.appendChild(label);
      p.appendChild(document.createTextNode(why));
      host.appendChild(p);

      var nav = document.createElement("div");
      nav.className = "quiz-nav";
      var btn = document.createElement("button");
      btn.className = "btn btn-primary";
      btn.type = "button";
      btn.textContent = i + 1 < Q.qs.length ? "Next question" : "See your result";
      btn.addEventListener("click", function () {
        i++;
        if (i < Q.qs.length) renderQuestion();
        else renderResult();
      });
      nav.appendChild(btn);
      var sc = document.createElement("span");
      sc.className = "score";
      sc.textContent = score + " / " + (i + 1) + " so far";
      nav.appendChild(sc);
      host.appendChild(nav);
      btn.focus();
    }

    function renderResult() {
      var passed = score >= 4;
      host.innerHTML = "";
      var box = document.createElement("div");
      box.className = "result";

      if (passed) {
        markDone(Q.idx);
        paintChrome();

        var chip = document.createElement("div");
        chip.className = "result-chip";
        var cs = document.createElement("span");
        cs.textContent = "10K";
        chip.appendChild(cs);
        box.appendChild(chip);

        var h = document.createElement("h3");
        h.textContent = score === 5 ? "Perfect score." : "Nice work.";
        box.appendChild(h);

        var p = document.createElement("p");
        p.textContent = "You got " + score + " out of " + Q.qs.length + ". Here's your code.";
        box.appendChild(p);

        var cb = document.createElement("div");
        cb.className = "code-box";
        var cl = document.createElement("div");
        cl.className = "code-label";
        cl.textContent = "Your code";
        var cw = document.createElement("div");
        cw.className = "code-word";
        cw.textContent = Q.code;
        var cpy = document.createElement("button");
        cpy.className = "copy-btn";
        cpy.type = "button";
        cpy.textContent = "Copy code";
        cpy.addEventListener("click", function () {
          var done = function () { cpy.textContent = "Copied"; setTimeout(function(){cpy.textContent="Copy code";}, 1800); };
          if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(Q.code).then(done, function(){});
          } else {
            var ta = document.createElement("textarea");
            ta.value = Q.code; document.body.appendChild(ta); ta.select();
            try { document.execCommand("copy"); done(); } catch (e) {}
            document.body.removeChild(ta);
          }
        });
        cb.appendChild(cl); cb.appendChild(cw); cb.appendChild(cpy);
        box.appendChild(cb);

        var claim = document.createElement("p");
        claim.className = "claim";
        claim.textContent = "Email this code and your ClubWPT username to " + CLAIM_EMAIL +
          " and we'll add 10,000 play chips to your account. One claim per lesson, per account.";
        box.appendChild(claim);

        var acts = document.createElement("div");
        acts.className = "result-actions";
        if (Q.next) {
          var na = document.createElement("a");
          na.className = "btn btn-primary";
          na.setAttribute("href", Q.next);
          na.textContent = "Next lesson";
          acts.appendChild(na);
        } else {
          var ha = document.createElement("a");
          ha.className = "btn btn-primary";
          ha.setAttribute("href", Q.home || "../../");
          ha.textContent = "Back to the course";
          acts.appendChild(ha);
        }
        var again = document.createElement("button");
        again.className = "btn btn-ghost";
        again.type = "button";
        again.textContent = "Retake";
        again.addEventListener("click", restart);
        acts.appendChild(again);
        box.appendChild(acts);
      } else {
        var h2 = document.createElement("h3");
        h2.textContent = "Close.";
        box.appendChild(h2);
        var p2 = document.createElement("p");
        p2.textContent = "You got " + score + " out of " + Q.qs.length +
          ". You need four to unlock the code. Have another look at the lesson and try again — there's no limit on attempts.";
        box.appendChild(p2);
        var acts2 = document.createElement("div");
        acts2.className = "result-actions";
        var rev = document.createElement("a");
        rev.className = "btn btn-ghost";
        rev.setAttribute("href", "#main");
        rev.textContent = "Review the lesson";
        var tryb = document.createElement("button");
        tryb.className = "btn btn-primary";
        tryb.type = "button";
        tryb.textContent = "Try again";
        tryb.addEventListener("click", restart);
        acts2.appendChild(tryb);
        acts2.appendChild(rev);
        box.appendChild(acts2);
      }
      host.appendChild(box);
      box.scrollIntoView({ behavior: "smooth", block: "center" });
    }

    function restart() {
      i = 0; score = 0;
      renderQuestion();
      document.getElementById("quiz").scrollIntoView({ behavior: "smooth", block: "start" });
    }

    renderQuestion();
  };

  document.addEventListener("DOMContentLoaded", paintChrome);
  if (document.readyState !== "loading") paintChrome();
})();
