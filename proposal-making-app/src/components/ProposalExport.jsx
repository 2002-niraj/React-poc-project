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
    position: "relative",
    fontFamily: "Helvetica",
    fontSize: 14,
    padding: 40, // prevents content spill to next page,
    overflow: "hidden",
  },
  backgroundImage: {
    position: "absolute",
    top: 0,
    left: 0,
     width: "595pt", // A4 width in points
    height: "842pt", // A4 height in points
    zIndex: -1,
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
    <Page size="A4" style={styles.page}  >  

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
         {/* <Image src="data:image/jpeg;base64,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" style={styles.backgroundImage} />  */}

        </View>
        <Text style={styles.companyName}>{companyName || "N/A"}</Text>
      </View>
             

      {logoPreview && <Image src={logoPreview} style={styles.logo} />}
        <Text style={styles.footerText}>For - Mediacorp Pte Ltd</Text>
         <Text style={styles.byText}>By {companyName || "N/A"} Labs Singapore Pte. Ltd.</Text>
         <Text style={styles.bottomText1}>Commercial Proposal for the Supply,Installation,Configuration,Migration,</Text>
         <Text style={styles.bottomText2}>Testing,Commissioning,and Ongoing Maintenance of BMC</Text>
             {/* ✅ Background image */}
               {/* <Image src="data:image/jpeg;base64,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" style={styles.backgroundImage} />  */}
               <Image src="https://res.cloudinary.com/djkyo1rmm/image/upload/v1759992352/b_image_vbbe12.png" style={styles.backgroundImage}></Image>
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
