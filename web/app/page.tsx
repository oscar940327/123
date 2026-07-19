"use client";

import { useEffect, useState } from "react";

const challenges = [
  {
    number: "01",
    eyebrow: "冷場急救",
    title: "氣氛僵硬，該怎麼繼續聊下去？",
    copy: "一句『哈哈』之後就沒了下文？軍師讀懂當下語氣，幫你找到自然、不尷尬的新話題。",
    chat: ["今天工作還好嗎？", "還好哈哈", "……"],
    accent: "violet",
  },
  {
    number: "02",
    eyebrow: "語氣拿捏",
    title: "想更靠近，又怕回得太刻意？",
    copy: "認真、幽默或曖昧，三種口吻一次給你。不是套話，而是依照你們的對話找到剛好的分寸。",
    chat: ["下次有機會再一起去", "這是在約我嗎？", "要怎麼回才不會太明顯？"],
    accent: "pink",
  },
  {
    number: "03",
    eyebrow: "讀懂訊號",
    title: "看不懂對方，到底是真的忙還是沒興趣？",
    copy: "聊死指數與一句語境判讀，幫你看懂對話溫度。每個建議都有原因，讓你越聊越會聊。",
    chat: ["最近比較忙", "晚點再跟你說", "已讀 2 小時"],
    accent: "cyan",
  },
];

export default function Home() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToChallenges = () => {
    document.getElementById("challenges")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <main>
      <header className={`nav ${scrolled ? "nav--scrolled" : ""}`}>
        <a className="brand" href="#top" aria-label="聊天軍師首頁">
          <span className="brand__orb"><img src="/chat-wingman-icon.png" alt="" /></span>
          <span>聊天軍師</span>
        </a>
        <button className="nav__cta" type="button">安裝 App</button>
      </header>

      <section className="hero" id="top">
        <div className="ambient ambient--one" />
        <div className="ambient ambient--two" />
        <div className="grid" />

        <div className="hero__content">
          <p className="pill reveal reveal--one"><span /> 你的 AI 聊天軍師，隨時待命</p>
          <h1 className="reveal reveal--two">
            聊天總是<br />
            <span>無法繼續？</span>
          </h1>
          <p className="hero__lead reveal reveal--three">
            不用離開聊天室。點一下，讀懂氣氛、找到話題，<br className="desktop" />
            讓每一段對話都有自然的下一句。
          </p>
          <div className="hero__actions reveal reveal--four">
            <button className="button button--primary" type="button">
              <span>安裝 App</span><span className="button__arrow">↗</span>
            </button>
            <button className="button button--ghost" type="button" onClick={scrollToChallenges}>
              了解更多 <span>↓</span>
            </button>
          </div>
          <p className="platform-note reveal reveal--four">目前支援 Android · 免費體驗</p>
        </div>

        <div className="hero__visual reveal reveal--three" aria-label="聊天軍師 App 操作示意">
          <div className="phone">
            <div className="phone__top"><span>9:41</span><i /><span>● ●</span></div>
            <div className="chat-header"><b>小安</b><small>在線上</small></div>
            <div className="messages">
              <p className="message message--in">今天工作還好嗎？</p>
              <p className="message message--out">還好哈哈</p>
              <p className="message message--in">哈哈</p>
            </div>
            <div className="typing"><span>輸入訊息...</span><b>➤</b></div>
          </div>
          <div className="wingman-orb"><img src="/chat-wingman-icon.png" alt="聊天軍師" /><i /></div>
          <div className="answer-card">
            <div className="answer-card__top">
              <span>軍師分析中</span><b>聊死指數 78</b>
            </div>
            <p>「我偵測到你的回覆能量只剩 3%，需要幫你充電嗎？⚡」</p>
            <small>幽默化解冷場，讓話題自然重新開始</small>
          </div>
        </div>

        <button className="scroll-cue" type="button" onClick={scrollToChallenges} aria-label="前往聊天困難">
          <span>SCROLL</span><i />
        </button>
      </section>

      <section className="challenges" id="challenges">
        <div className="section-heading">
          <p className="kicker">每一個卡住的瞬間</p>
          <h2>軍師都知道，<br /><span>下一句怎麼接。</span></h2>
          <p>那些讓你盯著輸入框發呆的時刻，我們都遇過。</p>
        </div>

        <div className="challenge-list">
          {challenges.map((item) => (
            <article className={`challenge challenge--${item.accent}`} key={item.number}>
              <div className="challenge__number">{item.number}</div>
              <div className="challenge__copy">
                <p className="challenge__eyebrow">{item.eyebrow}</p>
                <h3>{item.title}</h3>
                <p>{item.copy}</p>
                <span className="challenge__link">聊天軍師如何幫你 <b>→</b></span>
              </div>
              <div className="mini-chat" aria-hidden="true">
                {item.chat.map((line, index) => (
                  <p className={index === 1 ? "mini-chat__out" : ""} key={line}>{line}</p>
                ))}
                <div className="mini-chat__orb"><img src="/chat-wingman-icon.png" alt="" /></div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="closing">
        <div>
          <span className="brand__orb"><img src="/chat-wingman-icon.png" alt="" /></span>
          <h2>別讓一句「哈哈」<br />成為對話的句點。</h2>
          <p>軍師就在旁邊，陪你把話好好說下去。</p>
          <button className="button button--light" type="button">立即安裝 App <span>↗</span></button>
        </div>
      </section>
    </main>
  );
}
