"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { withBasePath } from "@/lib/basePath";

const CoffeeScene = dynamic(() => import("@/components/coffee/CoffeeScene"), {
  ssr: false,
  loading: () => (
    <div className="scene-loading">
      <span className="sun-icon">✳</span>
      <span>Brewing something good…</span>
    </div>
  ),
});

type Category = "Coffee" | "Matcha & more" | "Fresh bakes";
type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: Category;
  image: string;
  tag?: string;
};
const products: Product[] = [
  {
    id: "latte",
    name: "The Everyday Latte",
    description: "Double espresso, silky milk, a little magic.",
    price: 5.5,
    category: "Coffee",
    image: "latte",
    tag: "THE HOUSE FAVORITE",
  },
  {
    id: "coldbrew",
    name: "Slow & Steady Cold Brew",
    description: "Steeped for 18 hours. Worth every minute.",
    price: 5,
    category: "Coffee",
    image: "iced-coffee",
    tag: "KEEP IT COOL",
  },
  {
    id: "espresso",
    name: "The Daily Americano",
    description: "Double espresso, hot water. Simply good.",
    price: 4.5,
    category: "Coffee",
    image: "espresso",
    tag: "SMALL BUT MIGHTY",
  },
  {
    id: "matcha",
    name: "Cloud Nine Matcha",
    description: "Ceremonial matcha meets creamy oat milk.",
    price: 6,
    category: "Matcha & more",
    image: "matcha",
    tag: "A GREENER MORNING",
  },
  {
    id: "chocolate",
    name: "A Hug in a Mug",
    description: "Rich dark chocolate, steamed milk, pure comfort.",
    price: 5,
    category: "Matcha & more",
    image: "chocolate",
    tag: "SOMETHING COZY",
  },
  {
    id: "croissant",
    name: "The Golden Croissant",
    description: "Buttery, flaky, baked fresh every morning.",
    price: 4,
    category: "Fresh bakes",
    image: "croissant",
    tag: "FRESH FROM THE OVEN",
  },
  {
    id: "cookie",
    name: "The Really Good Cookie",
    description: "Brown butter, dark chocolate, flaky sea salt.",
    price: 3.5,
    category: "Fresh bakes",
    image: "cookie",
    tag: "YOUR COFFEE’S BEST FRIEND",
  },
];
const money = (value: number) => `$${value.toFixed(2)}`;

function Icon({
  name,
  className = "",
}: {
  name: "arrow" | "bag" | "leaf" | "cup" | "heart" | "pin" | "close" | "rotate";
  className?: string;
}) {
  const paths = {
    arrow: (
      <>
        <path d="M5 12h14M13 6l6 6-6 6" />
      </>
    ),
    bag: (
      <>
        <path d="M5 7h14l1 14H4L5 7Z" />
        <path d="M9 8V6a3 3 0 0 1 6 0v2" />
      </>
    ),
    leaf: (
      <>
        <path d="M20 3C8 2 2 9 6 16s15 1 14-13Z" />
        <path d="m4 21 11-12M9 16v-5" />
      </>
    ),
    cup: (
      <>
        <path d="M4 8h12v8a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4V8ZM16 9h2a3 3 0 1 1 0 6h-2M8 2v3M12 2v3" />
      </>
    ),
    heart: <path d="m12 20-8-8C-2 6 6-1 12 6c6-7 14 0 8 6l-8 8Z" />,
    pin: (
      <>
        <path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z" />
        <circle cx="12" cy="10" r="2" />
      </>
    ),
    close: <path d="m6 6 12 12M6 18 18 6" />,
    rotate: (
      <>
        <path d="M20 7v5h-5M4 17v-5h5" />
        <path d="M5 8a8 8 0 0 1 13-3l2 3M4 16l2 3a8 8 0 0 0 13-3" />
      </>
    ),
  };
  return (
    <svg
      className={className}
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
}

export default function Home() {
  const [category, setCategory] = useState<Category>("Coffee");
  const [variant, setVariant] = useState<"latte" | "espresso" | "matcha">(
    "latte",
  );
  const [bag, setBag] = useState<Record<string, number>>({});
  const [notice, setNotice] = useState("");
  const [orderStep, setOrderStep] = useState<"bag" | "checkout" | "done">(
    "bag",
  );
  const [customer, setCustomer] = useState("");
  const [pickup, setPickup] = useState("In 15–20 minutes");
  const [mobileMenu, setMobileMenu] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const bagButton = useRef<HTMLButtonElement>(null);
  const count = Object.values(bag).reduce((sum, quantity) => sum + quantity, 0);
  const total = products.reduce(
    (sum, product) => sum + product.price * (bag[product.id] || 0),
    0,
  );

  useEffect(() => {
    if (!notice) return;
    const timeout = setTimeout(() => setNotice(""), 2800);
    return () => clearTimeout(timeout);
  }, [notice]);

  function addToBag(product: Product) {
    setBag((current) => ({
      ...current,
      [product.id]: (current[product.id] || 0) + 1,
    }));
    setNotice(`${product.name} added to your bag`);
  }

  function changeQuantity(id: string, change: number) {
    setBag((current) => ({
      ...current,
      [id]: Math.max(0, (current[id] || 0) + change),
    }));
  }

  function openBag() {
    setOrderStep("bag");
    dialog.current?.showModal();
    document.body.style.overflow = "hidden";
  }

  function closeBag() {
    dialog.current?.close();
    document.body.style.overflow = "";
    bagButton.current?.focus();
  }

  return (
    <>
      <div className="announcement">
        <span>GOOD COFFEE. GOOD PEOPLE. EVERY SINGLE DAY.</span>
        <span className="announcement-detail">
          A little slower. A little better. <span>↗</span>
        </span>
      </div>
      <header className="site-header">
        <a className="brand" href="#home" aria-label="Morrow home">
          <span className="brand-sun">✳</span>
          <span>
            morrow<span className="brand-caption">COFFEE & COMPANY</span>
          </span>
          <span className="brand-period">®</span>
        </a>
        <nav
          aria-label="Main navigation"
          className={mobileMenu ? "navigation is-open" : "navigation"}
        >
          <a href="#menu" onClick={() => setMobileMenu(false)}>
            Our menu
          </a>
          <a href="#story" onClick={() => setMobileMenu(false)}>
            Our story
          </a>
          <a href="#visit" onClick={() => setMobileMenu(false)}>
            Find your Morrow <span>↗</span>
          </a>
        </nav>
        <div className="header-actions">
          <button ref={bagButton} className="bag-button" onClick={openBag}>
            <Icon name="bag" />
            <span>Your bag</span>
            <span className="bag-count">{count}</span>
          </button>
          <button
            className="mobile-menu-button"
            aria-label={mobileMenu ? "Close navigation" : "Open navigation"}
            aria-expanded={mobileMenu}
            onClick={() => setMobileMenu(!mobileMenu)}
          >
            {mobileMenu ? "✕" : "☰"}
          </button>
        </div>
      </header>
      <main id="home">
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-copy">
            <div className="eyebrow">
              <span className="tiny-sun">✳</span> YOUR DAILY DOSE OF SOMETHING
              GOOD
            </div>
            <h1 id="hero-title">
              Good coffee.
              <br />
              Better
              <br />
              <em>mornings.</em>
              <span className="heading-spark">✳</span>
            </h1>
            <p>
              Life moves fast. Your coffee shouldn’t.
              <br />
              Thoughtfully sourced, lovingly brewed.
              <br className="mobile-break" /> A little moment, just for you.
            </p>
            <div className="hero-actions">
              <a className="button button-primary" href="#menu">
                Find your favorite <Icon name="arrow" />
              </a>
              <a className="text-link" href="#story">
                A little about us <span>↗</span>
              </a>
            </div>
            <div className="hero-footnote">
              <span className="footnote-line" /> INDEPENDENT SPIRIT. EXCEPTIONAL
              COFFEE.
            </div>
          </div>
          <div className="hero-visual">
            <div className="orbit orbit-one" />
            <div className="orbit orbit-two" />
            <div className="round-stamp">
              <span>FRESHLY BREWED</span>
              <span className="stamp-sun">✺</span>
              <span>HAPPILY SIPPED</span>
            </div>
            <span className="visual-note">a cup full of possibility.</span>
            <div className="coffee-scene">
              <CoffeeScene variant={variant} />
            </div>
            <div className="scene-caption">
              <span className="scene-caption-line" />
              <span>YOUR NEW MORNING RITUAL</span>
            </div>
            <div className="scene-controls">
              <span className="drag-hint">
                <Icon name="rotate" /> Give it a little spin
              </span>
              <div
                className="variant-controls"
                role="group"
                aria-label="Choose a drink to preview"
              >
                {(["latte", "espresso", "matcha"] as const).map((drink) => (
                  <button
                    key={drink}
                    onClick={() => setVariant(drink)}
                    aria-label={`Preview ${drink}`}
                    aria-pressed={variant === drink}
                    className={`variant-dot ${drink} ${variant === drink ? "selected" : ""}`}
                  >
                    <span />
                  </button>
                ))}
              </div>
              <span className="variant-label">
                {variant === "latte"
                  ? "House latte"
                  : variant === "espresso"
                    ? "Espresso"
                    : "Oat matcha"}
              </span>
            </div>
          </div>
          <a className="scroll-note" href="#menu">
            SCROLL TO SAVOR <span>↓</span>
          </a>
        </section>
        <section className="values-strip" aria-label="Our promise">
          <div>
            <Icon name="leaf" />
            <span>Good from the ground up</span>
            <small>Ethically sourced beans</small>
          </div>
          <span className="value-star">✳</span>
          <div>
            <Icon name="cup" />
            <span>Small batches. Big heart.</span>
            <small>Roasted fresh, always</small>
          </div>
          <span className="value-star">✳</span>
          <div>
            <Icon name="heart" />
            <span>A little more than coffee</span>
            <small>Your neighborhood kind of place</small>
          </div>
        </section>
        <section
          className="menu-section section-wrap"
          id="menu"
          aria-labelledby="menu-title"
        >
          <div className="section-heading">
            <div>
              <p className="eyebrow">THE USUAL, OR SOMETHING NEW?</p>
              <h2 id="menu-title">
                Meet your <em>next favorite.</em>
              </h2>
            </div>
            <p>
              Made with care.
              <br />
              Enjoyed at your own pace.
            </p>
          </div>
          <div className="menu-toolbar">
            <div
              className="menu-tabs"
              role="group"
              aria-label="Menu categories"
            >
              {(["Coffee", "Matcha & more", "Fresh bakes"] as Category[]).map(
                (item) => (
                  <button
                    key={item}
                    aria-pressed={category === item}
                    className={category === item ? "active" : ""}
                    onClick={() => setCategory(item)}
                  >
                    {item}
                  </button>
                ),
              )}
            </div>
            <span className="menu-detail">
              A GOOD DAY STARTS WITH A GOOD CHOICE <span>↙</span>
            </span>
          </div>
          <div className="product-grid">
            {products
              .filter((product) => product.category === category)
              .map((product) => (
                <article key={product.id} className="product-card">
                  <div className="product-image">
                    <span className="product-tag">{product.tag}</span>
                    <Image
                      src={withBasePath(`/images/${product.image}.jpg`)}
                      alt={product.name}
                      fill
                      sizes="(max-width: 650px) 90vw, (max-width: 960px) 45vw, 30vw"
                    />
                    <button
                      className="add-button"
                      aria-label={`Add ${product.name} to bag`}
                      onClick={() => addToBag(product)}
                    >
                      +
                    </button>
                  </div>
                  <div className="product-title">
                    <h3>{product.name}</h3>
                    <span>{money(product.price)}</span>
                  </div>
                  <p>{product.description}</p>
                </article>
              ))}
          </div>
          <div className="menu-footer">
            <span>
              <Icon name="leaf" /> Your cup, your way. Oat milk is always on us.
            </span>
            <span>All good things, made fresh daily.</span>
          </div>
        </section>
        <section
          className="story-section"
          id="story"
          aria-labelledby="story-title"
        >
          <div className="story-image">
            <Image
              src={withBasePath("/images/story.jpg")}
              alt="Freshly brewed coffee surrounded by roasted coffee beans"
              fill
              sizes="(max-width: 700px) 100vw, 50vw"
            />
            <span className="story-image-label">
              MORE THAN A CUP. A CONNECTION.
            </span>
          </div>
          <div className="story-copy">
            <span className="story-sun">✳</span>
            <p className="eyebrow">A SMALL SHOP. A BIG BELIEF.</p>
            <h2 id="story-title">
              Good things
              <br />
              take <em>a little time.</em>
            </h2>
            <p>
              We believe in the first sip. In knowing your name. In a space that
              feels like a deep breath in the middle of your day.
            </p>
            <p>
              That’s why we take the long way — from responsibly grown beans to
              the care in every pour. Nothing rushed. Nothing complicated. Just
              really good coffee, and a little room to slow down.
            </p>
            <a className="text-link" href="#visit">
              Make yourself at home <Icon name="arrow" />
            </a>
          </div>
        </section>
        <section className="visit-section section-wrap" id="visit">
          <div>
            <p className="eyebrow">THERE’S A SEAT WITH YOUR NAME ON IT</p>
            <h2>
              See you in <em>the morning.</em>
            </h2>
            <p>Come for the coffee. Stay for a little while.</p>
          </div>
          <div className="visit-details">
            <div>
              <Icon name="pin" />
              <div>
                <h3>Our little corner</h3>
                <p>Portland, Oregon</p>
                <span>A neighborhood café concept</span>
              </div>
            </div>
            <div>
              <Icon name="cup" />
              <div>
                <h3>Early birds. Slow mornings.</h3>
                <p>
                  Monday–Friday <strong>7am–5pm</strong>
                  <br />
                  Saturday–Sunday <strong>8am–5pm</strong>
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer>
        <a className="footer-brand" href="#home">
          morrow<span>✳</span>
        </a>
        <div>
          <span>GOOD COFFEE. BETTER MORNINGS.</span>
          <p>
            © {new Date().getFullYear()} Morrow Coffee & Company · A café
            concept
          </p>
        </div>
        <a href="#home" className="back-top" aria-label="Back to top">
          ↑
        </a>
      </footer>
      <div className={`toast ${notice ? "visible" : ""}`} role="status">
        <Icon name="bag" />
        {notice}
      </div>
      <dialog
        ref={dialog}
        className="bag-dialog"
        aria-labelledby="bag-title"
        onCancel={closeBag}
        onClick={(event) => {
          if (event.target === event.currentTarget) closeBag();
        }}
        onClose={() => {
          document.body.style.overflow = "";
        }}
      >
        <div className="bag-panel">
          <div className="bag-heading">
            <span className="eyebrow">A LITTLE SOMETHING GOOD</span>
            <button
              className="icon-button"
              aria-label="Close bag"
              onClick={closeBag}
            >
              <Icon name="close" />
            </button>
          </div>
          <h2 id="bag-title">
            {orderStep === "done"
              ? "A good morning, planned."
              : orderStep === "checkout"
                ? "Make it yours."
                : "Your morning bag."}
          </h2>
          {orderStep === "done" ? (
            <div className="order-confirmation">
              <span className="confirmation-sun">✳</span>
              <h3>Thanks, {customer}.</h3>
              <p>
                Your demo order is ready to imagine.
                <br />
                Pickup: {pickup.toLowerCase()}.
              </p>
              <p className="demo-note">
                This is a café concept. No real order was placed and no payment
                was taken.
              </p>
              <button className="button button-primary" onClick={closeBag}>
                Back to the good stuff <Icon name="arrow" />
              </button>
            </div>
          ) : orderStep === "checkout" ? (
            <form
              className="checkout-form"
              onSubmit={(event) => {
                event.preventDefault();
                if (!customer.trim()) return;
                setOrderStep("done");
                setBag({});
              }}
            >
              <button
                className="text-link"
                type="button"
                onClick={() => setOrderStep("bag")}
              >
                ← Back to your bag
              </button>
              <label>
                Your first name
                <input
                  autoComplete="given-name"
                  name="name"
                  required
                  maxLength={60}
                  value={customer}
                  onChange={(event) => setCustomer(event.target.value)}
                  placeholder="What should we call you?"
                />
              </label>
              <label>
                When sounds good?
                <select
                  value={pickup}
                  onChange={(event) => setPickup(event.target.value)}
                >
                  <option>In 15–20 minutes</option>
                  <option>In 30 minutes</option>
                  <option>In 1 hour</option>
                </select>
              </label>
              <div className="bag-total">
                <span>Order total</span>
                <strong>{money(total)}</strong>
              </div>
              <p className="demo-note">
                Just a little preview of the Morrow experience. This demo won’t
                place a real order or collect payment.
              </p>
              <button className="button button-primary" type="submit">
                Confirm demo order <Icon name="arrow" />
              </button>
            </form>
          ) : count === 0 ? (
            <div className="empty-bag">
              <Icon name="cup" />
              <h3>Something good belongs here.</h3>
              <p>Find your favorite. We’ll save you a spot.</p>
              <button
                className="button button-primary"
                onClick={() => {
                  closeBag();
                  document
                    .getElementById("menu")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                Explore the menu <Icon name="arrow" />
              </button>
            </div>
          ) : (
            <>
              <div className="bag-items">
                {products
                  .filter((product) => bag[product.id] > 0)
                  .map((product) => (
                    <div className="bag-item" key={product.id}>
                      <div>
                        <h3>{product.name}</h3>
                        <p>{money(product.price)} each</p>
                        <div className="quantity-control">
                          <button
                            aria-label={`Remove one ${product.name}`}
                            onClick={() => changeQuantity(product.id, -1)}
                          >
                            −
                          </button>
                          <span>{bag[product.id]}</span>
                          <button
                            aria-label={`Add one ${product.name}`}
                            onClick={() => changeQuantity(product.id, 1)}
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <strong>{money(product.price * bag[product.id])}</strong>
                    </div>
                  ))}
              </div>
              <div className="bag-summary">
                <div className="bag-total">
                  <span>Subtotal</span>
                  <strong>{money(total)}</strong>
                </div>
                <p>Good coffee. No rush. Pickup only.</p>
                <button
                  className="button button-primary"
                  onClick={() => setOrderStep("checkout")}
                >
                  Plan your pickup <Icon name="arrow" />
                </button>
                <p className="demo-note">
                  A demo experience — no payment required.
                </p>
              </div>
            </>
          )}
        </div>
      </dialog>
    </>
  );
}
