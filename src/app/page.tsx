'use client';
import Image from "next/image";
import styles from "./page.module.css";
import LogoutButton from "@/components/logoutBtn";
import TreatmentsButton from "@/components/treatmentsBtn";
import DatesButton from "@/components/datesBtn";
import useDates from '@/presentation/hooks/useDate';
import useDatesHandlers from '@/presentation/handlers/useDateHandler';
import { useEffect } from "react";

import NumberDatesPerStatusChart from "@/components/charts/DatesCharts";
import { Paper } from "@mui/material";

export default function Home() {
  const datesState = useDates();
  
    const {
      handleFetchDates,
    } = useDatesHandlers(datesState);
  
    const {
      dates,
      searchTerm,
    } = datesState;
    useEffect(() => {
        handleFetchDates(searchTerm);
        return () => handleFetchDates.cancel();
      }, [searchTerm, handleFetchDates]);
  return (
    <Paper elevation={3} style={{ padding: "20px", margin: "20px" }}>
      <NumberDatesPerStatusChart
            dates={dates}/>
    </Paper>
    
    /*<div className={styles.page}>
      <main className={styles.main}>
        <Image
          className={styles.logo}
          src="/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />
        <ol>
          <li>
            Get started by editing <code>src/app/page.tsx</code>.
          </li>
          <li>Save and see your changes instantly.</li>
        </ol>

        <div className={styles.ctas}>
          <a
            className={styles.primary}
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              className={styles.logo}
              src="/vercel.svg"
              alt="Vercel logomark"
              width={20}
              height={20}
            />
            Deploy now
          </a>
          <a
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.secondary}
          >
            Read our docs
          </a>
        </div>
        <TreatmentsButton/>
        <LogoutButton/>
        <DatesButton/>
      </main>
      <footer className={styles.footer}>
        <a
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Learn
        </a>
        <a
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to nextjs.org →
        </a>
      </footer>
    </div>*/
  );
}
