import { siteConfig } from "@/lib/site";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Research",
  description: "Research publications and academic work by Rafi Hasan.",
  alternates: {
    canonical: "/research",
  },
  openGraph: {
    type: "website",
    title: "Research",
    description: "Research publications and academic work by Rafi Hasan.",
    url: "/research",
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: "Rafi Hasan",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Research",
    description: "Research publications and academic work by Rafi Hasan.",
    images: [siteConfig.ogImage],
  },
};

const publications = [
  {
    id: "soil-ph-prediction",
    title: "Soil pH Prediction Using Deep Learning: An Ensemble Approach",
    authors: "MA Hasan, S Mahfuz",
    venue: "Procedia Computer Science 265, 293-300",
    year: "2025",
    url: "https://scholar.google.com/citations?view_op=view_citation&hl=en&user=fFq6TTAAAAAJ&citation_for_view=fFq6TTAAAAAJ:d1gkVwhDpl0C",
    abstract:
      "Accurate prediction of soil potential of Hydrogen (pH) is crucial for optimizing agricultural practices and understanding environmental processes. This study investigates the application of deep learning techniques for predicting soil pH levels using the LUCAS 2018 TOPSOIL dataset, enhanced with textural information. The research aims to provide an effective method for estimating this crucial soil property. The methodology involves comprehensive data preprocessing, including imputation, scaling, and encoding, followed by extensive feature engineering, including the creation of interaction terms, ratios, and logarithmic transformations. Additionally, implementing a custom binning technique based on soil science thresholds helped capture non-linear relationships.",
  },
  {
    id: "efficient-ddos",
    title: "Efficient DDoS Detection with Minimal Features: High Accuracy Using CIC-DDoS2019",
    authors: "MDA Hasan, A Eaman, E Hassan",
    venue: "Procedia Computer Science 265, 124-131",
    year: "2025",
    url: "https://scholar.google.com/citations?view_op=view_citation&hl=en&user=fFq6TTAAAAAJ&citation_for_view=fFq6TTAAAAAJ:u-x6o8ySG0sC",
    abstract:
      "Distributed Denial of Service (DDoS) attacks remain a critical threat to network security, stability, and service availability necessitating robust detection mechanisms. This research demonstrates that just five carefully selected features from the CIC-DDoS2019 dataset can achieve classification accuracy exceeding 98%, comparable to complex models using the full feature set. Our analysis identifies TCP flags (particularly ACK and URG), packet rate metrics, and specific TCP window characteristics as the most discriminative features for DDoS attack type classification. Both XGBoost and MLP models trained on this minimal feature set showed less than 1% performance degradation compared to full-feature models.",
  },
  {
    id: "multi-scale-soil",
    title: "Multi Scale Soil Moisture Prediction Using Recurrent Neural Networks with Temporal Attention",
    authors: "MD Ahad Hasan, Sazia Mahfuz",
    venue: "Department of Computer Science, Acadia University",
    year: "2024",
    url: "https://scholar.google.com/citations?view_op=view_citation&hl=en&user=fFq6TTAAAAAJ&citation_for_view=fFq6TTAAAAAJ:2osOgNQ5qMEC",
    abstract:
      "Soil moisture (SM) is a critical variable in hydrological and agricultural systems, yet accurate multi depth forecasts remain difficult due to nonlinear, depth dependent dynamics. This study develops and evaluates data driven recurrent neural network models for short to medium range soil moisture prediction at an International Soil Moisture Network (ISMN) site within Canada’s Real-Time In-Situ Soil Monitoring for Agriculture (RISMA) network in Saskatchewan. We evaluate Gated Recurrent Unit (GRU), Long Short-Term Memory (LSTM), and a custom Attention-GRU model across 1, 3, and 7-day horizons, incorporating fused sensor data, meteorological inputs, and hydrologically informed features.",
  },
  {
    id: "deep-learning-approaches-soil",
    title: "Deep Learning Approaches for Soil Moisture Prediction",
    authors: "MDA Hasan",
    venue: "The 38th Canadian Conference on Artificial Intelligence",
    year: "2025",
    url: "https://scholar.google.com/citations?view_op=view_citation&hl=en&user=fFq6TTAAAAAJ&citation_for_view=fFq6TTAAAAAJ:IjCSPb-OGe4C",
  },
  {
    id: "tower-defense",
    title: "Senior Design Project: Tower Defense",
    authors: "MDA Hasan, SA Sami",
    venue: "North South University",
    year: "2020",
    url: "https://scholar.google.com/citations?view_op=view_citation&hl=en&user=fFq6TTAAAAAJ&citation_for_view=fFq6TTAAAAAJ:u5HHmVD_uO8C",
  },
];

export default function ResearchPage() {
  return (
    <main className="container max-w-4xl mx-auto py-12 px-4">
      <div className="flex flex-col gap-6 mb-12">
        <h1 className="text-4xl font-semibold">Research</h1>
        <p className="text-muted-foreground max-w-2xl leading-relaxed">
          My academic publications and research work, primarily focusing on applied machine learning, deep learning architectures, and environmental modeling.
        </p>
      </div>

      <div className="flex flex-col gap-8">
        {publications.map((pub) => (
          <article
            key={pub.id}
            className="group border-2 border-muted bg-card p-6 sm:p-8 flex flex-col gap-4 transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_0px_var(--color-fd-foreground)] hover:border-fd-foreground"
          >
            <div className="flex flex-col gap-1 mb-2">
              <h2 className="text-2xl font-semibold uppercase">{pub.title}</h2>
              <p className="text-sm text-fd-primary font-mono uppercase tracking-widest mt-2">
                {pub.authors}
              </p>
              <p className="text-sm text-fd-muted-foreground mt-1">
                {pub.venue} • {pub.year}
              </p>
            </div>

            {pub.abstract && (
              <div className="prose max-w-none prose-sm sm:prose-base prose-p:leading-relaxed prose-p:text-fd-muted-foreground">
                <p>{pub.abstract}</p>
              </div>
            )}

            <a
              href={pub.url}
              target="_blank"
              rel="noreferrer"
              className="text-fd-primary font-semibold text-sm underline underline-offset-4 decoration-1 hover:decoration-2 mt-2 self-start uppercase tracking-widest"
            >
              View on Google Scholar →
            </a>
          </article>
        ))}
      </div>
    </main>
  );
}
