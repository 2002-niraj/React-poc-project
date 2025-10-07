// ProposalExport.jsx
import React, { useState } from "react";
import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
  PDFDownloadLink,
} from "@react-pdf/renderer";

// PDF styles
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: "Helvetica",
    fontSize: 14,
    position: "relative", // for absolute logo positioning
  },
  backgroundImage: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    zIndex: -1, // ensures background stays behind everything
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  leftColumn: {
    flexDirection: "column",
    marginLeft: 40,
  },
  heading: {
    fontSize: 12,
    fontWeight: "bold",
  },
  value: {
    fontSize: 12,
  },
  // ✅ Added new style for spacing between lines
  infoRow: {
    marginBottom: 8, 
  },
  companyName: {
    fontSize: 28,
    fontWeight: "bold",
    marginRight: 40,
    marginTop: -20,
  },
  logo: {
    width: 80,
    height: 80,
    position: "absolute",
    bottom: 160,
    right: 80,
  },
    footerText: {
    fontSize: 26,
    color: "purple",
     position: "absolute",
    bottom: 120,
    right: 80,
  },
    byText: {
    fontSize: 13, // same as value
    position: "absolute",
    bottom: 90, // below footerText
    right: 80,
  },
  bottomText1: {
    fontSize: 11,
    position: "absolute",
    bottom: 70,
    right: 80,
  },
    bottomText2: {
    fontSize: 11,
    position: "absolute",
    bottom: 58,
    right: 80,
  },
});

// ✅ PDF Document component
const ProposalDocument = ({ date, version, companyName, logoPreview }) => (
  <Document>
    <Page style={styles.page}>  
      {/* ✅ Background image */}
      <Image src="/b_image.jpg" style={styles.backgroundImage} />
      <View style={styles.topRow}>
        <View style={styles.leftColumn}>
          {/* Add margin between Date and Version */}
          <View style={styles.infoRow}>
            <Text>
              <Text style={styles.heading}>Date of Submission: </Text>
              <Text style={styles.value}>{date || "N/A"}</Text>
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text>
              <Text style={styles.heading}>Version: </Text>
              <Text style={styles.value}> {version ? `${version}.0` : "N/A"}</Text>
            </Text>
          </View>
        </View>
        <Text style={styles.companyName}>{companyName || "N/A"}</Text>
      </View>

      {logoPreview && <Image src={logoPreview} style={styles.logo} />}
        <Text style={styles.footerText}>For - Mediacorp Pte Ltd</Text>
         <Text style={styles.byText}>By {companyName || "N/A"} Labs Singapore Pte. Ltd.</Text>
         <Text style={styles.bottomText1}>Commercial Proposal for the Supply,Installation,Configuration,Migration,</Text>
         <Text style={styles.bottomText2}>Testing,Commissioning,and Ongoing Maintenance of BMC</Text>
    </Page>
  </Document>
);

export default function ProposalExport() {
  const [formData, setFormData] = useState({
    date: "",
    version: "",
    companyName: "",
    logoPreview: null,
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Fixed logo upload (Base64)
  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, logoPreview: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

 return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          📄 Proposal Maker
        </h2>

        <input
          type="text"
          name="companyName"
          placeholder="Company Name"
          value={formData.companyName}
          onChange={handleChange}
          className="block w-full p-3 mb-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
        />

        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          className="block w-full p-3 mb-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
        />

        <input
          type="text"
          name="version"
          placeholder="Version"
          value={formData.version}
          onChange={handleChange}
          className="block w-full p-3 mb-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
        />

        <input
          type="file"
          accept="image/*"
          onChange={handleLogoChange}
          className="block w-full mb-4"
        />

        {formData.logoPreview && (
          <div className="flex justify-center mb-4">
            <img
              src={formData.logoPreview}
              alt="Logo Preview"
              className="w-24 h-24 object-contain border border-gray-300 rounded-lg"
            />
          </div>
        )}

        <div className="text-center">
          <PDFDownloadLink
            document={<ProposalDocument {...formData} />}
            fileName={`${formData.companyName || "proposal"}.pdf`}
            className="inline-block px-5 py-2 bg-blue-600 text-white cursor-pointer font-semibold rounded-lg hover:bg-blue-700 transition"
          >
            {({ loading }) =>
              loading ? "Preparing document..." : "⬇️ Download Proposal PDF"
            }
          </PDFDownloadLink>
        </div>
      </div>
    </div>
  );
}
