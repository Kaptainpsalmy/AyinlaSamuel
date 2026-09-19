"""Server-generated CV PDF via reportlab. Pure compute, no external services."""
import io
from fastapi import APIRouter
from fastapi.responses import StreamingResponse

from api.core import cv_data as cv

router = APIRouter(tags=["cv"])


def _build_pdf() -> bytes:
    from reportlab.lib.pagesizes import A4
    from reportlab.lib.units import mm
    from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
    from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, ListFlowable, ListItem

    buf = io.BytesIO()
    doc = SimpleDocTemplate(buf, pagesize=A4, leftMargin=18 * mm, rightMargin=18 * mm,
                            topMargin=16 * mm, bottomMargin=16 * mm, title=f"{cv.NAME} CV")
    ss = getSampleStyleSheet()
    h_name = ParagraphStyle("name", parent=ss["Title"], fontSize=20, spaceAfter=2)
    h_role = ParagraphStyle("role", parent=ss["Normal"], fontSize=11, textColor="#2b2bff", spaceAfter=4)
    small = ParagraphStyle("small", parent=ss["Normal"], fontSize=8.5, textColor="#555")
    sec = ParagraphStyle("sec", parent=ss["Heading2"], fontSize=10, spaceBefore=12, spaceAfter=4, textColor="#111")
    body = ParagraphStyle("body", parent=ss["Normal"], fontSize=9.5, leading=13)
    role_line = ParagraphStyle("rl", parent=ss["Normal"], fontSize=10, spaceBefore=6)

    el = [Paragraph(cv.NAME, h_name), Paragraph(cv.ROLE, h_role),
          Paragraph(cv.CONTACT, small), Paragraph(cv.LINKS, small),
          Paragraph("PROFILE", sec), Paragraph(cv.PROFILE, body),
          Paragraph("EXPERIENCE", sec)]
    for role, company, dates, points in cv.EXPERIENCE:
        el.append(Paragraph(f"<b>{role}</b> at {company}  <font color='#888' size=8>{dates}</font>", role_line))
        el.append(ListFlowable([ListItem(Paragraph(p, body), leftIndent=10) for p in points],
                               bulletType="bullet", start="circle"))
    el.append(Paragraph("SKILLS", sec))
    for label, items in cv.SKILLS:
        el.append(Paragraph(f"<b>{label}:</b> {items}", body))
    el.append(Paragraph("EDUCATION", sec))
    el.append(Paragraph(f"<b>{cv.EDUCATION[0]}</b>, {cv.EDUCATION[1]}", body))
    el.append(Paragraph("CERTIFICATIONS", sec))
    el.append(ListFlowable([ListItem(Paragraph(c, body), leftIndent=10) for c in cv.CERTS],
                           bulletType="bullet", start="circle"))

    doc.build(el)
    return buf.getvalue()


@router.get("/api/py/resume", summary="Download CV as PDF")
def resume() -> StreamingResponse:
    pdf = _build_pdf()
    return StreamingResponse(
        io.BytesIO(pdf), media_type="application/pdf",
        headers={"Content-Disposition": 'attachment; filename="Ayinla-Samuel-CV.pdf"'},
    )
