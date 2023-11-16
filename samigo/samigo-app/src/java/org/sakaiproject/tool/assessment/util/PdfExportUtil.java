package org.sakaiproject.tool.assessment.util;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Optional;

import org.sakaiproject.tool.assessment.ui.model.AssessmentReport;
import org.sakaiproject.tool.assessment.ui.model.AssessmentReportSection;
import org.sakaiproject.tool.assessment.ui.model.AssessmentReport.AssessmentReportOrientation;

import com.lowagie.text.Document;
import com.lowagie.text.DocumentException;
import com.lowagie.text.PageSize;
import com.lowagie.text.Paragraph;
import com.lowagie.text.Phrase;
import com.lowagie.text.Rectangle;
import com.lowagie.text.pdf.PdfCell;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;

import lombok.extern.slf4j.Slf4j;

@Slf4j
public class PdfExportUtil {


    private static final int TABLE_WIDTH_PCT = 100;
    private static final int TABLE_MARGIN = 5;
    private static final int CELL_VERTICAL_ALIGNMENT = PdfCell.ALIGN_MIDDLE;
    private static final int CELL_HORIZONTAL_ALIGNMENT = PdfCell.ALIGN_LEFT;
    private static final int CELL_PADDING = 3;


    public static String assessmentReportToPdf(AssessmentReport report) throws IOException {
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        Optional<String> reportTitle = report.getTitle();
        Optional<String> reportSubject = report.getSubject();

        try {
            Document document = new Document();
            Rectangle pageSize = PageSize.A4;
            if (AssessmentReportOrientation.LANDSCAPE.equals(report.getOrientation())) {
                pageSize = pageSize.rotate();
            }
            document.setPageSize(pageSize);
            PdfWriter.getInstance(document, out);
            document.open();
            reportTitle.ifPresent(document::addTitle);
            reportSubject.ifPresent(document::addSubject);

            List<AssessmentReportSection> sections = report.getSections();

            for (int i = 0; i < sections.size(); i++) {
                AssessmentReportSection section = sections.get(i);
                List<List<String>> tableData = section.getTable();

                // Create title row
                if (reportTitle.isPresent()) {
                    log.debug("Adding report title");
                    document.add(new Paragraph(reportTitle.get()));
                }

                // Create subject row
                if (reportSubject.isPresent()) {
                    log.debug("Adding report subject");
                    document.add(new Paragraph(reportSubject.get()));
                }

                Optional<String> sectionTitle = section.getTitle();
                if (sectionTitle.isPresent()) {
                    log.debug("Adding section title");
                    document.add(new Paragraph(sectionTitle.get()));
                }

                // Create empty row if there is a title or subject
                if (reportTitle.isPresent() || reportSubject.isPresent()) {
                    log.debug("Adding empty paragraph");
                    document.add(new Paragraph());
                }

                // Column count of the longest row
                int maxColumnCount = tableData.stream()
                        .mapToInt(List::size)
                        .max()
                        .orElse(0);

                // Create table and add section data
                PdfPTable table = createTable(maxColumnCount);
                for (int j = 0; j < tableData.size(); j++) {
                    List<String> rowData = tableData.get(j);

                    int rowColumnCount = rowData.size();
                    for (int k = 0; k < rowColumnCount; k++) {
                        table.addCell(createCell(rowData.get(k)));
                    }

                    // Add empty cells if the current row is shorter then the longest one
                    int emptyColumnCount = maxColumnCount - rowColumnCount;
                    for (int k = 0; k < emptyColumnCount; k++) {
                        table.addCell("");
                    }
                }

                // Add created table to document
                document.add(table);

                // Add page break after section
                document.newPage();
            }

            document.close();
        } catch (DocumentException e) {
            throw new IOException(e);
        }

        return out.toString(StandardCharsets.ISO_8859_1);
    }

    private static PdfPTable createTable(int columnCount) {
        PdfPTable table = new PdfPTable(columnCount);

        // Set table defaults
        table.setWidthPercentage(TABLE_WIDTH_PCT);
        table.setSpacingBefore(TABLE_MARGIN);
        table.setSpacingAfter(TABLE_MARGIN);

        return table;
    }

    private static PdfPCell createCell(String content) {
        PdfPCell cell = new PdfPCell();

        // Set cell default
        cell.setUseAscender(true);
        cell.setVerticalAlignment(CELL_VERTICAL_ALIGNMENT);
        cell.setHorizontalAlignment(CELL_HORIZONTAL_ALIGNMENT);
        cell.setPadding(CELL_PADDING);

        // Set content
        cell.setPhrase(new Phrase(content));

        return cell;
    }
}
