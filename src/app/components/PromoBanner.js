"use client";
import { useState, useEffect } from "react";
import { Container, Button } from "react-bootstrap";
import Link from "next/link";
import styles from "@/styles/Home.module.css";

export default function PromoBanner() {
  const [timeLeft, setTimeLeft] = useState(5 * 60 * 60); // 5 horas en segundos

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer); // Limpia el intervalo al desmontar
  }, []);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <section className={styles.promoBanner}>
      <Container>
        <p className={styles.promoText}>
          ¡Oferta especial! 20% de descuento en todos los productos. Termina en: <strong>{formatTime(timeLeft)}</strong>
        </p>
        <Link href="/products">
          <Button className={styles.promoButton}>Aprovecha Ahora</Button>
        </Link>
      </Container>
    </section>
  );
}