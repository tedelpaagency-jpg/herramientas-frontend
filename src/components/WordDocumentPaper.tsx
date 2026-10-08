'use client';

import React, { useState, useMemo, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import {
  FileText,
  Printer,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Copy,
  Check,
  ChevronLeft,
  ChevronRight,
  PlusCircle,
  Trash2,
  Layers,
  LayoutList,
  Plus,
  Undo2,
  Redo2,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Indent,
  Outdent,
  Palette,
  Save,
  Sliders,
  X,
  Edit3,
  Sparkles,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { getApiBaseUrl, normalizeFileUrl } from '../services/apiClient';

export interface WordDocumentPaperRef {
  save: () => Promise<void>;
  getCurrentHtml: () => string;
}

export interface WordDocumentPaperProps {
  htmlContent: string;
  onContentChange?: (newHtml: string) => void;
  fieldValues?: Record<string, string>;
  onFieldValuesChange?: (newFieldValues: Record<string, string>) => void;
  tokens?: string[];
  onTokensChange?: (newTokens: string[]) => void;
  onSave?: (savedHtml: string, savedFieldValues: Record<string, string>, savedTokens?: string[]) => void | Promise<void>;
  title?: string;
  documentNumber?: string;
  watermarkText?: string;
  backgroundImageUrl?: string;
  signatureUrl?: string;
  showToolbar?: boolean;
  editablePages?: boolean;
  isContract?: boolean;
  className?: string;
}

export const PAGE_BREAK_MARKER = `<div class="page-break" style="page-break-after: always; break-after: page; border-top: 2px dashed #cbd5e1; margin: 2rem 0; text-align: center; color: #94a3b8; font-size: 10px; font-weight: bold; text-transform: uppercase;" data-page-break="true">--- Salto de Hoja ---</div>`;

export const WordDocumentPaper = forwardRef<WordDocumentPaperRef, WordDocumentPaperProps>(({
  htmlContent,
  onContentChange,
  fieldValues = {},
  onFieldValuesChange,
  tokens = [],
  onTokensChange,
  onSave,
  title = 'Documento Legal',
  documentNumber,
  watermarkText,
  backgroundImageUrl,
  signatureUrl,
  showToolbar = true,
  editablePages = true,
  isContract = false,
  className = '',
}, ref) => {
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [copied, setCopied] = useState(false);
  const [currentPageIndex, setCurrentPageIndex] = useState<number>(0);
  const [viewMode, setViewMode] = useState<'continuous' | 'single'>('continuous');

  // Auto mobile scaling state to maintain fixed 816px Letter paper proportions on mobile devices
  const workspaceRef = useRef<HTMLDivElement | null>(null);
  const [autoMobileScale, setAutoMobileScale] = useState<number>(1);

  useEffect(() => {
    const handleResize = () => {
      if (workspaceRef.current) {
        const availableW = workspaceRef.current.clientWidth - 24;
        if (availableW > 0 && availableW < 816) {
          setAutoMobileScale(availableW / 816);
        } else {
          setAutoMobileScale(1);
        }
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const effectiveScale = useMemo(() => {
    return (zoomLevel / 100) * autoMobileScale;
  }, [zoomLevel, autoMobileScale]);

  // Internal state for HTML content & Campos/Variables Values (Preserves tokens intact in editor)
  const [localHtml, setLocalHtml] = useState<string>(htmlContent);
  const [storedBgImage, setStoredBgImage] = useState<string | null>(backgroundImageUrl || null);
  const [tokenValues, setTokenValues] = useState<Record<string, string>>(fieldValues);

  // Managed Tokens State & Shortcuts modal
  const [managedTokens, setManagedTokens] = useState<string[]>(() => {
    const list: string[] = [];
    if (tokens && Array.isArray(tokens)) {
      tokens.forEach((t) => {
        const u = String(t).replace(/[\{\}\[\]]/g, '').trim().toUpperCase();
        if (u && !list.includes(u)) list.push(u);
      });
    }
    return list;
  });

  const [isShortcutsModalOpen, setIsShortcutsModalOpen] = useState(false);
  const [shortcutsModalTab, setShortcutsModalTab] = useState<'manage' | 'fill'>(isContract ? 'fill' : 'manage');
  const [newShortcutName, setNewShortcutName] = useState('');
  const [editingTokenOriginal, setEditingTokenOriginal] = useState<string | null>(null);
  const [editingTokenName, setEditingTokenName] = useState<string>('');

  // Synchronize initial prop and extract background image URL to persistent state
  useEffect(() => {
    setLocalHtml(htmlContent);

    if (backgroundImageUrl !== undefined) {
      setStoredBgImage(backgroundImageUrl);
      return;
    }
    if (!htmlContent) return;

    const dataMatch = htmlContent.match(/data-bg-image=["']([^"']+)["']/i);
    if (dataMatch) {
      setStoredBgImage(dataMatch[1]);
      return;
    }

    const urlMatch = htmlContent.match(/(?:background-image|background)\s*:\s*url\((?:&quot;|&#34;|&#39;|["'])?([^"'\)\s&]+)(?:&quot;|&#34;|&#39;|["'])?\)/i);
    if (urlMatch) {
      setStoredBgImage(urlMatch[1]);
      return;
    }

    const bgAttrMatch = htmlContent.match(/\bbackground=["']([^"']+)["']/i);
    if (bgAttrMatch) {
      setStoredBgImage(bgAttrMatch[1]);
      return;
    }
  }, [htmlContent, backgroundImageUrl]);

  useEffect(() => {
    if (fieldValues && Object.keys(fieldValues).length > 0) {
      setTokenValues(fieldValues);
    }
  }, [fieldValues]);

  useEffect(() => {
    if (tokens && Array.isArray(tokens) && tokens.length > 0) {
      setManagedTokens((prev) => {
        const set = new Set(prev);
        tokens.forEach((t) => {
          const u = String(t).replace(/[\{\}\[\]]/g, '').trim().toUpperCase();
          if (u) set.add(u);
        });
        return Array.from(set);
      });
    }
  }, [tokens]);

  // Update HTML content and ensure background image attribute is NEVER lost
  const updateHtml = (newBodyContent: string) => {
    let finalHtml = newBodyContent;
    // Strip existing data-bg-image tags first
    finalHtml = finalHtml.replace(/<div[^>]*data-bg-image=["'][^"']*["'][^>]*>\s*<\/div>\n?/gi, '');

    if (storedBgImage && storedBgImage !== 'none' && storedBgImage.trim() !== '') {
      finalHtml = `<div data-bg-image="${storedBgImage}"></div>\n` + finalHtml;
    }
    setLocalHtml(finalHtml);
    if (onContentChange) {
      onContentChange(finalHtml);
    }
  };

  const pageRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Extracted background image URL prioritizing stored persistent state
  const extractedBg = useMemo(() => {
    if (backgroundImageUrl === 'none' || backgroundImageUrl === '') return null;
    if (backgroundImageUrl) return normalizeFileUrl(backgroundImageUrl);
    if (storedBgImage === 'none' || storedBgImage === '') return null;
    if (storedBgImage) return normalizeFileUrl(storedBgImage);
    if (!localHtml) return null;

    const dataMatch = localHtml.match(/data-bg-image=["']([^"']+)["']/i);
    if (dataMatch && dataMatch[1] !== 'none' && dataMatch[1] !== '') return normalizeFileUrl(dataMatch[1]);

    const urlMatch = localHtml.match(/(?:background-image|background)\s*:\s*url\((?:&quot;|&#34;|&#39;|["'])?([^"'\)\s&]+)(?:&quot;|&#34;|&#39;|["'])?\)/i);
    if (urlMatch && urlMatch[1] !== 'none' && urlMatch[1] !== '') return normalizeFileUrl(urlMatch[1]);

    const bgAttrMatch = localHtml.match(/\bbackground=["']([^"']+)["']/i);
    if (bgAttrMatch && bgAttrMatch[1] !== 'none' && bgAttrMatch[1] !== '') return normalizeFileUrl(bgAttrMatch[1]);

    return null;
  }, [localHtml, backgroundImageUrl, storedBgImage]);

  // Detect all variables / tokens in localHtml (e.g. {{CLIENTE_NOMBRE}}, [MONTO], etc.)
  const detectedTokensInHtml = useMemo(() => {
    if (!localHtml) return [];
    const regex = /(?:\{\{|\[)([A-Z0-9_]+)(?:\}\}|\])/gi;
    const found: string[] = [];
    let match;
    while ((match = regex.exec(localHtml)) !== null) {
      const tok = match[1].toUpperCase();
      if (!['FIRMA', 'FIRMA_CLIENTE', 'FIRMA_USUARIO'].includes(tok) && !found.includes(tok)) {
        found.push(tok);
      }
    }
    return found;
  }, [localHtml]);

  // Unified allTokens list
  const allTokens = useMemo(() => {
    const set = new Set<string>();
    managedTokens.forEach((t) => set.add(t));
    detectedTokensInHtml.forEach((t) => set.add(t));
    if (tokenValues) {
      Object.keys(tokenValues).forEach((t) => {
        const u = t.replace(/[\{\}\[\]]/g, '').trim().toUpperCase();
        if (u && !['FIRMA', 'FIRMA_CLIENTE', 'FIRMA_USUARIO'].includes(u)) {
          set.add(u);
        }
      });
    }
    return Array.from(set);
  }, [managedTokens, detectedTokensInHtml, tokenValues]);

  // Insert token into active editor or page
  const handleInsertToken = (tok: string) => {
    const formatted = `{{${tok}}}`;
    let inserted = false;
    try {
      inserted = document.execCommand('insertText', false, formatted);
    } catch (e) {
      inserted = false;
    }
    if (!inserted) {
      const newPages = [...pages];
      const pageIdx = Math.max(0, Math.min(currentPageIndex, newPages.length - 1));
      newPages[pageIdx] = (newPages[pageIdx] || '') + ` ${formatted} `;
      const updatedBody = newPages.join(`\n${PAGE_BREAK_MARKER}\n`);
      updateHtml(updatedBody);
    }
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(formatted).catch(() => {});
    }
    toast.success(`Shortcut ${formatted} insertado en el texto`);
  };

  // Add new shortcut
  const handleAddShortcut = (rawName?: string, insert: boolean = false) => {
    const target = (rawName !== undefined ? rawName : newShortcutName).trim();
    if (!target) {
      toast.error('Ingrese el nombre del shortcut');
      return;
    }
    const formatted = target
      .replace(/[\{\}\[\]]/g, '')
      .trim()
      .toUpperCase()
      .replace(/\s+/g, '_')
      .replace(/[^A-Z0-9_]/g, '');

    if (!formatted) {
      toast.error('Nombre de shortcut no válido');
      return;
    }

    if (allTokens.includes(formatted)) {
      toast.error(`El shortcut {{${formatted}}} ya existe`);
      return;
    }

    const updated = [...managedTokens, formatted];
    setManagedTokens(updated);
    if (onTokensChange) onTokensChange(updated);

    setTokenValues((prev) => ({ ...prev, [formatted]: '' }));
    setNewShortcutName('');

    if (insert) {
      handleInsertToken(formatted);
    } else {
      toast.success(`Shortcut {{${formatted}}} registrado`);
    }
  };

  // Start rename
  const handleStartRenameToken = (tok: string) => {
    setEditingTokenOriginal(tok);
    setEditingTokenName(tok);
  };

  // Save rename
  const handleSaveRenameToken = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTokenOriginal) return;

    const formatted = editingTokenName
      .replace(/[\{\}\[\]]/g, '')
      .trim()
      .toUpperCase()
      .replace(/\s+/g, '_')
      .replace(/[^A-Z0-9_]/g, '');

    if (!formatted) {
      toast.error('Nombre no válido');
      return;
    }

    if (formatted === editingTokenOriginal) {
      setEditingTokenOriginal(null);
      return;
    }

    if (allTokens.includes(formatted)) {
      toast.error(`El shortcut {{${formatted}}} ya existe`);
      return;
    }

    const orig = editingTokenOriginal;
    const updated = managedTokens.map((t) => (t === orig ? formatted : t));
    if (!updated.includes(formatted)) updated.push(formatted);
    setManagedTokens(updated);
    if (onTokensChange) onTokensChange(updated);

    // Transfer tokenValues
    setTokenValues((prev) => {
      const next = { ...prev };
      if (orig in next) {
        next[formatted] = next[orig];
        delete next[orig];
      }
      return next;
    });

    // Replace in full HTML document
    const currentHtml = getCurrentFullHtml();
    const regex = new RegExp(`(?:\\{\\{|\\[)${orig}(?:\\}\\}|\\])`, 'g');
    const replacedHtml = currentHtml.replace(regex, `{{${formatted}}}`);
    updateHtml(replacedHtml);

    setEditingTokenOriginal(null);
    toast.success(`Shortcut renombrado de {{${orig}}} a {{${formatted}}} en la lista y texto`);
  };

  // Delete shortcut
  const handleDeleteToken = (tok: string) => {
    const updated = managedTokens.filter((t) => t !== tok);
    setManagedTokens(updated);
    if (onTokensChange) onTokensChange(updated);

    setTokenValues((prev) => {
      const next = { ...prev };
      delete next[tok];
      return next;
    });

    toast.success(`Shortcut {{${tok}}} eliminado de la lista`);
  };

  // Save values
  const handleSaveTokenValues = (e: React.FormEvent) => {
    e.preventDefault();
    if (onFieldValuesChange) {
      onFieldValuesChange(tokenValues);
    }
    if (onTokensChange) {
      onTokensChange(allTokens);
    }
    setIsShortcutsModalOpen(false);
    toast.success('Valores de los shortcuts guardados exitosamente.');
  };

  // Clean inner inline background images & white backgrounds, normalize img src URLs and substitute signature tag if signatureUrl is present
  const sanitizedHtml = useMemo(() => {
    if (!localHtml) return '';

    let clean = localHtml
      .replace(/<div[^>]*data-bg-image=["'][^"']+["'][^>]*>\s*<\/div>/gi, '')
      .replace(/data-bg-image=["'][^"']+["']/gi, '')
      .replace(/background-image\s*:\s*url\([^)]+\);?/gi, '')
      .replace(/background\s*:\s*url\([^)]+\);?/gi, '')
      .replace(/background-color\s*:\s*(?:#fff(?:fff)?|white|rgba\([^)]+\));?/gi, '')
      .replace(/background\s*:\s*(?:#fff(?:fff)?|white|rgba\([^)]+\));?/gi, '');

    // Normalize image src URLs inside clean HTML so signatures & embedded images resolve to correct backend API host and bypass 403 web server blocks
    const apiBase = getApiBaseUrl().replace(/\/api$/, '');
    clean = clean.replace(/<img([^>]+)src=["']([^"']+)["']([^>]*)>/gi, (match, prefix, src, suffix) => {
      let normalized = src;
      if (src.startsWith('data:') || src.startsWith('blob:')) {
        normalized = src;
      } else if (src.includes('/signatures/')) {
        const filename = src.substring(src.lastIndexOf('/') + 1);
        normalized = `${apiBase}/api/v1/public/storage/signatures/${filename}`;
      } else if (src.startsWith('/')) {
        normalized = `${apiBase}${src}`;
      } else if (src.includes('/storage/')) {
        const idx = src.indexOf('/storage/');
        if (idx !== -1) {
          normalized = `${apiBase}${src.substring(idx)}`;
        }
      } else if (src.includes('localhost') || src.includes('127.0.0.1') || src.includes('santun.tedelpa.com')) {
        try {
          const urlObj = new URL(src);
          const apiObj = new URL(apiBase);
          urlObj.protocol = apiObj.protocol;
          urlObj.hostname = apiObj.hostname;
          urlObj.port = apiObj.port;
          normalized = urlObj.toString();
        } catch (e) {}
      }
      return `<img${prefix}src="${normalized}"${suffix}>`;
    });

    const hasEmbeddedSignature =
      /<img[^>]+(?:alt=["']Firma Digital["']|src=["'][^"']*(?:signatures|base64|data:)[^"']*["'])/i.test(clean) ||
      /p12-signature-badge/i.test(clean) ||
      /signature-stamp/i.test(clean);

    if (!hasEmbeddedSignature && signatureUrl) {
      const isPdfOrCert = /\.(pdf|p12|pfx)(\?.*)?$/i.test(signatureUrl);
      if (!isPdfOrCert) {
        const normalizedSig = normalizeFileUrl(signatureUrl);
        const sigHtml = `
          <div class="signature-stamp text-center my-4 p-2 border border-slate-300 rounded-lg bg-white/50 backdrop-blur-xs inline-block">
            <img src="${normalizedSig}" alt="Firma Digital" class="max-w-[220px] max-h-[85px] object-contain mx-auto" />
            <div class="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-widest mt-1">Firma Digital Registrada</div>
          </div>
        `;
        const sigRegex = /(?:\{\{|\[)(?:FIRMA|FIRMA_CLIENTE)(?:\}\}|\])/gi;
        if (sigRegex.test(clean)) {
          clean = clean.replace(sigRegex, sigHtml);
        } else {
          clean += `<br/><br/>${sigHtml}`;
        }
      }
    }

    return clean;
  }, [localHtml, signatureUrl]);

  // Split content into individual pages based on page break markers
  const pages = useMemo(() => {
    if (!sanitizedHtml) return ['<p style="text-align: justify;">Escriba aquí el contenido del documento...</p>'];

    const splitRegex = /(?:<div[^>]*data-page-break=["']true["'][^>]*>.*?<\/div>|<div[^>]*class=["'][^"']*page-break[^"']*["'][^>]*>.*?<\/div>|<div[^>]*style=["'][^"']*(?:page-break-after|break-after)\s*:\s*always[^"']*["'][^>]*>.*?<\/div>|<hr[^>]*class=["'][^"']*page-break[^"']*["'][^>]*\/?>|<!--\s*pagebreak\s*-->)/gi;

    const parts = sanitizedHtml.split(splitRegex).map((p) => p.trim());
    const validParts = parts.filter((p) => p.length > 0);
    return validParts.length > 0 ? validParts : [sanitizedHtml];
  }, [sanitizedHtml]);

  // Extract live HTML directly from page DOM nodes to guarantee no typed characters are lost
  const getCurrentFullHtml = (): string => {
    const pageBodies: string[] = [];
    if (pageRefs.current && pageRefs.current.length > 0) {
      for (let i = 0; i < pages.length; i++) {
        const sheet = pageRefs.current[i];
        const bodyEl = sheet?.querySelector('.word-document-body') as HTMLElement | null;
        if (bodyEl) {
          pageBodies.push(bodyEl.innerHTML);
        } else if (pages[i]) {
          pageBodies.push(pages[i]);
        }
      }
    }
    const combined = pageBodies.length > 0 ? pageBodies.join(`\n${PAGE_BREAK_MARKER}\n`) : localHtml;

    let finalHtml = combined.replace(/<div[^>]*data-bg-image=["'][^"']*["'][^>]*>\s*<\/div>\n?/gi, '');
    if (storedBgImage && storedBgImage !== 'none' && storedBgImage.trim() !== '') {
      finalHtml = `<div data-bg-image="${storedBgImage}"></div>\n` + finalHtml;
    }
    return finalHtml;
  };

  // Save Document and Field Values for public view replacement
  const handleSave = async () => {
    const finalHtml = getCurrentFullHtml();
    setLocalHtml(finalHtml);
    if (onContentChange) {
      onContentChange(finalHtml);
    }
    if (onSave) {
      await onSave(finalHtml, tokenValues, allTokens);
    }
  };

  useImperativeHandle(ref, () => ({
    save: handleSave,
    getCurrentHtml: getCurrentFullHtml,
  }), [pages, localHtml, storedBgImage, tokenValues, allTokens, onSave, onContentChange]);

  // Execute rich text formatting commands (Word Style Toolbar formatDoc as in inmosoft lexvault_edit)
  const formatDoc = (cmd: string, value: string | undefined = undefined) => {
    try {
      document.execCommand(cmd, false, value);
    } catch (e) {
      console.error('Error formatDoc:', e);
    }
  };

  // Handle Page Navigation
  const scrollToPage = (index: number) => {
    const targetIdx = Math.max(0, Math.min(index, pages.length - 1));
    setCurrentPageIndex(targetIdx);

    if (viewMode === 'continuous' && pageRefs.current[targetIdx]) {
      pageRefs.current[targetIdx]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handlePrevPage = () => {
    scrollToPage(currentPageIndex - 1);
  };

  const handleNextPage = () => {
    scrollToPage(currentPageIndex + 1);
  };

  // Add Page (Insert Page Break)
  const handleAddPage = () => {
    if (!editablePages) return;
    const newPageContent = `<p style="text-align: justify;">Escriba aquí el contenido de la Hoja ${pages.length + 1}...</p>`;
    const newPages = [...pages, newPageContent];
    const updatedBody = newPages.join(`\n${PAGE_BREAK_MARKER}\n`);

    updateHtml(updatedBody);
    toast.success(`Hoja ${newPages.length} agregada al documento`);
    setTimeout(() => scrollToPage(newPages.length - 1), 100);
  };

  // Delete Page (Remove page break and page content)
  const handleDeletePage = (indexToDelete: number) => {
    if (!editablePages) return;
    if (pages.length <= 1) {
      toast.error('El documento debe contener al menos 1 hoja');
      return;
    }

    const newPages = pages.filter((_, idx) => idx !== indexToDelete);
    const updatedBody = newPages.join(`\n${PAGE_BREAK_MARKER}\n`);

    updateHtml(updatedBody);
    toast.success(`Hoja ${indexToDelete + 1} eliminada`);
    const nextIdx = Math.min(currentPageIndex, newPages.length - 1);
    setCurrentPageIndex(nextIdx);
  };

  // Handle Page Overflow only when total children content height actually exceeds the 11-inch Letter sheet limit (~820px)
  const checkPageOverflow = (pageIdx: number, target: HTMLDivElement) => {
    if (!editablePages) return;

    const children = Array.from(target.children) as HTMLElement[];
    if (children.length <= 1) return; // If 0 or 1 paragraph, NEVER break page!

    let totalContentHeight = 0;
    for (let i = 0; i < children.length; i++) {
      totalContentHeight += (children[i] as HTMLElement).offsetHeight || 24;
    }

    // Only trigger overflow page break when actual content elements exceed 820px
    if (totalContentHeight > 820) {
      let accumulatedH = 0;
      let splitIdx = children.length - 1;

      for (let i = 0; i < children.length; i++) {
        const h = (children[i] as HTMLElement).offsetHeight || 24;
        if (accumulatedH + h > 780 && i > 0) {
          splitIdx = i;
          break;
        }
        accumulatedH += h;
      }

      if (splitIdx > 0 && splitIdx < children.length) {
        const keepNodes = children.slice(0, splitIdx);
        const moveNodes = children.slice(splitIdx);

        const keepHtml = keepNodes.map((n) => n.outerHTML).join('');
        const moveHtml = moveNodes.map((n) => n.outerHTML).join('');

        const newPages = [...pages];
        newPages[pageIdx] = keepHtml;

        if (pageIdx + 1 < newPages.length) {
          newPages[pageIdx + 1] = moveHtml + '\n' + newPages[pageIdx + 1];
        } else {
          newPages.push(moveHtml);
        }

        const updatedBody = newPages.join(`\n${PAGE_BREAK_MARKER}\n`);
        updateHtml(updatedBody);

        toast('Salto de hoja automático por espacio', { icon: '📄' });
        setTimeout(() => scrollToPage(pageIdx + 1), 100);
      }
    }
  };

  // Smooth Enter Key Press & Native Paragraph Handling
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>, pageIdx: number) => {
    if (!editablePages) return;
    if (e.key === 'Enter') {
      const target = e.currentTarget;
      setTimeout(() => {
        checkPageOverflow(pageIdx, target);
      }, 50);
    }
  };

  // Save changes smoothly onBlur without disrupting active typing
  const handlePageBlur = (pageIdx: number, target: HTMLDivElement) => {
    if (!editablePages) return;
    const newPages = [...pages];
    newPages[pageIdx] = target.innerHTML;
    const updatedBody = newPages.join(`\n${PAGE_BREAK_MARKER}\n`);
    updateHtml(updatedBody);
  };

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 10, 150));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 10, 70));
  };

  const handleResetZoom = () => {
    setZoomLevel(100);
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      toast.error('No se pudo abrir la ventana de impresión');
      return;
    }

    const fullPagesHtml = pages
      .map(
        (pageHtml, idx) => `
        <div class="print-page ${idx < pages.length - 1 ? 'has-break' : ''}">
          ${extractedBg ? `<img src="${extractedBg}" class="bg-print-cover" alt="Fondo Hoja ${idx + 1}" />` : ''}
          <div class="print-content">
            ${pageHtml}
          </div>
        </div>
      `
      )
      .join('');

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${title}</title>
          <style>
            @page {
              size: letter;
              margin: 0;
            }
            html, body {
              margin: 0;
              padding: 0;
              width: 100%;
              height: 100%;
              font-family: 'Georgia', 'Times New Roman', serif;
              color: #0f172a;
              line-height: 1.6;
              font-size: 12pt;
              box-sizing: border-box;
              background-color: #ffffff;
            }
            .print-page {
              position: relative;
              box-sizing: border-box;
              padding: 1in;
              min-height: 11in;
              width: 8.5in;
              margin: 0 auto;
              background-color: transparent;
              overflow: hidden;
            }
            .has-break {
              page-break-after: always;
              break-after: page;
            }
            .bg-print-cover {
              position: absolute;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              min-width: 100%;
              min-height: 100%;
              object-fit: cover;
              object-position: center;
              z-index: -1;
              pointer-events: none;
            }
            .print-content {
              position: relative;
              z-index: 1;
            }
            .print-content, .print-content * {
              background: transparent !important;
              background-color: transparent !important;
              background-image: none !important;
            }
            h1, h2, h3, h4 {
              text-align: center;
              text-transform: uppercase;
              font-weight: bold;
              margin-top: 1.5em;
              margin-bottom: 0.8em;
            }
            p {
              text-align: justify;
              margin-bottom: 1em;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 2em;
              margin-bottom: 2em;
            }
            td {
              padding: 10px;
              vertical-align: top;
            }
          </style>
        </head>
        <body>
          ${fullPagesHtml}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  };

  const handleCopyText = () => {
    const tempElement = document.createElement('div');
    tempElement.innerHTML = localHtml;
    const textOnly = tempElement.innerText || tempElement.textContent || '';
    navigator.clipboard.writeText(textOnly);
    setCopied(true);
    toast.success('Texto del documento copiado al portapapeles');
    setTimeout(() => setCopied(false), 2000);
  };

  const visiblePages = viewMode === 'single' ? [pages[currentPageIndex] || pages[0]] : pages;

  return (
    <div className={`flex flex-col bg-slate-200/90 dark:bg-slate-900/90 rounded-2xl overflow-hidden border border-slate-300/80 dark:border-slate-800 shadow-inner ${className}`}>
      {/* Global CSS to force all text, paragraphs, tables, and divs inside the document to have 100% transparent backgrounds */}
      <style>{`
        .word-document-body,
        .word-document-body *,
        .word-document-body p,
        .word-document-body div,
        .word-document-body span,
        .word-document-body h1,
        .word-document-body h2,
        .word-document-body h3,
        .word-document-body h4,
        .word-document-body h5,
        .word-document-body h6,
        .word-document-body table,
        .word-document-body tr,
        .word-document-body td,
        .word-document-body th,
        .word-document-body ul,
        .word-document-body ol,
        .word-document-body li {
          background: transparent !important;
          background-color: transparent !important;
        }
        .word-document-body img[alt="Firma Digital"],
        .word-document-body img[src*="signatures"],
        .word-document-body img[src*="data:image"] {
          max-width: 220px !important;
          max-height: 85px !important;
          object-fit: contain !important;
          display: inline-block !important;
          margin: 8px auto !important;
        }
      `}</style>

      {/* Word Style Toolbar Ribbon */}
      {showToolbar && (
        <div className="bg-slate-800 text-white flex flex-col border-b border-slate-700 text-xs select-none">
          {/* Row 1: File Title, Page Navigation & Core Actions */}
          <div className="px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 border-b border-slate-700/60">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white shrink-0 shadow-xs">
                <FileText className="w-4 h-4" />
              </div>
              <div className="truncate">
                <h4 className="font-bold text-white truncate text-xs">{title}</h4>
                <p className="text-[10px] text-slate-400 font-mono flex items-center gap-1.5">
                  {documentNumber ? <span>Ref: {documentNumber} •</span> : null}
                  <span>Hoja Tamaño Carta (Letter 8.5 × 11 in)</span>
                </p>
              </div>
            </div>

            {/* Center Navigation & Page Controls */}
            <div className="flex items-center gap-2 bg-slate-900/90 px-3 py-1 rounded-xl border border-slate-700 text-slate-200">
              <button
                type="button"
                onClick={handlePrevPage}
                disabled={currentPageIndex <= 0}
                className="p-1 hover:text-white disabled:opacity-30 transition-colors"
                title="Hoja anterior"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <span className="font-mono text-xs font-bold px-1 text-blue-400">
                Hoja {currentPageIndex + 1} de {pages.length}
              </span>

              <button
                type="button"
                onClick={handleNextPage}
                disabled={currentPageIndex >= pages.length - 1}
                className="p-1 hover:text-white disabled:opacity-30 transition-colors"
                title="Siguiente hoja"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              <div className="h-3.5 w-px bg-slate-700 mx-1" />

              <button
                type="button"
                onClick={() => setViewMode(viewMode === 'continuous' ? 'single' : 'continuous')}
                className="p-1 hover:text-white transition-colors flex items-center gap-1 text-[11px] font-semibold text-slate-300"
                title={viewMode === 'continuous' ? 'Cambiar a Vista de Hoja Única' : 'Cambiar a Vista de Todas las Hojas'}
              >
                {viewMode === 'continuous' ? <LayoutList className="w-3.5 h-3.5 text-blue-400" /> : <Layers className="w-3.5 h-3.5 text-amber-400" />}
                <span className="hidden lg:inline">{viewMode === 'continuous' ? 'Vista Continua' : 'Vista Por Hoja'}</span>
              </button>

              {/* Add & Delete Page Buttons - ONLY in Edit Mode */}
              {editablePages && (
                <>
                  <div className="h-3.5 w-px bg-slate-700 mx-1" />

                  <button
                    type="button"
                    onClick={handleAddPage}
                    className="p-1 text-emerald-400 hover:text-emerald-300 transition-colors flex items-center gap-1 text-[11px] font-bold"
                    title="Agregar nueva hoja (Salto de página)"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">+ Hoja</span>
                  </button>

                  {pages.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleDeletePage(currentPageIndex)}
                      className="p-1 text-rose-400 hover:text-rose-300 transition-colors flex items-center gap-1 text-[11px] font-bold"
                      title={`Eliminar Hoja ${currentPageIndex + 1}`}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Eliminar</span>
                    </button>
                  )}
                </>
              )}
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-2">
              {/* Manage & Fill Shortcuts Button - ONLY in Edit Mode */}
              {editablePages && (
                <button
                  type="button"
                  onClick={() => {
                    setShortcutsModalTab(isContract ? 'fill' : 'manage');
                    setIsShortcutsModalOpen(true);
                  }}
                  className="p-1.5 px-2.5 rounded-lg bg-indigo-950/80 hover:bg-indigo-900 border border-indigo-700/60 text-indigo-300 font-bold transition-all flex items-center gap-1.5 shadow-2xs text-xs"
                  title="Gestionar y Llenar Shortcuts / Variables"
                >
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Shortcuts {allTokens.length > 0 ? `(${allTokens.length})` : ''}</span>
                </button>
              )}

              {/* Save Document Button - ONLY in Edit Mode */}
              {editablePages && (
                <button
                  type="button"
                  onClick={handleSave}
                  className="p-1.5 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-colors flex items-center gap-1.5 shadow-2xs text-xs"
                  title="Guardar cambios del documento"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Guardar</span>
                </button>
              )}

              {/* Zoom Controls */}
              <div className="hidden sm:flex items-center bg-slate-900/80 px-2 py-1 rounded-lg border border-slate-700 gap-1 text-slate-300">
                <button
                  type="button"
                  onClick={handleZoomOut}
                  disabled={zoomLevel <= 70}
                  className="p-1 hover:text-white disabled:opacity-40 transition-colors"
                  title="Reducir zoom"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <span className="font-mono text-[11px] px-1 font-bold w-12 text-center text-blue-400">
                  {zoomLevel}%
                </span>
                <button
                  type="button"
                  onClick={handleZoomIn}
                  disabled={zoomLevel >= 150}
                  className="p-1 hover:text-white disabled:opacity-40 transition-colors"
                  title="Aumentar zoom"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
                {zoomLevel !== 100 && (
                  <button
                    type="button"
                    onClick={handleResetZoom}
                    className="p-1 hover:text-amber-400 transition-colors ml-1"
                    title="Restablecer a 100%"
                  >
                    <RotateCcw className="w-3 h-3" />
                  </button>
                )}
              </div>

              {/* Copy Button */}
              <button
                type="button"
                onClick={handleCopyText}
                className="p-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 transition-colors flex items-center gap-1 font-semibold"
                title="Copiar texto del documento"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span className="hidden md:inline text-[11px]">Copiar</span>
              </button>

              {/* Print Button */}
              <button
                type="button"
                onClick={handlePrint}
                className="p-1.5 px-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold transition-colors flex items-center gap-1.5 shadow-2xs"
                title="Imprimir documento"
              >
                <Printer className="w-3.5 h-3.5" />
                <span className="text-[11px]">Imprimir</span>
              </button>
            </div>
          </div>

          {/* Row 2: Rich Text Formatting Ribbon Toolbar - ONLY in Edit Mode */}
          {editablePages && (
            <div className="px-4 py-1.5 bg-slate-900/70 flex flex-wrap items-center gap-1 text-slate-200 border-t border-slate-700/50 overflow-x-auto">
              <button
                type="button"
                onClick={() => formatDoc('undo')}
                className="p-1.5 hover:bg-slate-700 rounded-md transition-colors text-slate-300 hover:text-white"
                title="Deshacer (Undo)"
              >
                <Undo2 className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => formatDoc('redo')}
                className="p-1.5 hover:bg-slate-700 rounded-md transition-colors text-slate-300 hover:text-white"
                title="Rehacer (Redo)"
              >
                <Redo2 className="w-4 h-4" />
              </button>

              <div className="h-4 w-px bg-slate-700 mx-1" />

              <select
                onChange={(e) => formatDoc('fontName', e.target.value)}
                className="bg-slate-950 text-slate-200 text-[11px] font-semibold rounded-md border border-slate-700 px-2 py-1 focus:outline-none focus:border-blue-500 cursor-pointer"
                title="Fuente del sistema"
              >
                <option value="">Fuente...</option>
                <option value="Arial">Arial</option>
                <option value="Arial Black">Arial Black</option>
                <option value="Times New Roman">Times New Roman</option>
                <option value="Georgia">Georgia</option>
                <option value="Courier New">Courier New</option>
                <option value="Verdana">Verdana</option>
              </select>

              <select
                onChange={(e) => formatDoc('fontSize', e.target.value)}
                className="bg-slate-950 text-slate-200 text-[11px] font-semibold rounded-md border border-slate-700 px-2 py-1 focus:outline-none focus:border-blue-500 cursor-pointer"
                title="Tamaño de letra"
              >
                <option value="">Tamaño...</option>
                <option value="1">10 pt</option>
                <option value="2">12 pt</option>
                <option value="3">14 pt</option>
                <option value="4">16 pt</option>
                <option value="5">18 pt</option>
                <option value="6">20 pt</option>
                <option value="7">24 pt</option>
              </select>

              <div className="h-4 w-px bg-slate-700 mx-1" />

              <label className="relative p-1.5 hover:bg-slate-700 rounded-md cursor-pointer transition-colors flex items-center justify-center" title="Color de letra">
                <Palette className="w-4 h-4 text-amber-400" />
                <input
                  type="color"
                  defaultValue="#0f172a"
                  onChange={(e) => formatDoc('foreColor', e.target.value)}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                />
              </label>

              <div className="h-4 w-px bg-slate-700 mx-1" />

              <button
                type="button"
                onClick={() => formatDoc('bold')}
                className="p-1.5 hover:bg-slate-700 rounded-md font-extrabold text-xs transition-colors hover:text-white px-2"
                title="Negrita (Bold)"
              >
                <Bold className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => formatDoc('italic')}
                className="p-1.5 hover:bg-slate-700 rounded-md font-serif italic text-xs transition-colors hover:text-white px-2"
                title="Cursiva (Italic)"
              >
                <Italic className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => formatDoc('underline')}
                className="p-1.5 hover:bg-slate-700 rounded-md underline text-xs transition-colors hover:text-white px-2"
                title="Subrayado (Underline)"
              >
                <Underline className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => formatDoc('strikeThrough')}
                className="p-1.5 hover:bg-slate-700 rounded-md text-xs transition-colors hover:text-white px-2"
                title="Tachado (Strikethrough)"
              >
                <Strikethrough className="w-4 h-4" />
              </button>

              <div className="h-4 w-px bg-slate-700 mx-1" />

              <button
                type="button"
                onClick={() => formatDoc('justifyLeft')}
                className="p-1.5 hover:bg-slate-700 rounded-md transition-colors text-slate-300 hover:text-white"
                title="Alinear a la izquierda"
              >
                <AlignLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => formatDoc('justifyCenter')}
                className="p-1.5 hover:bg-slate-700 rounded-md transition-colors text-slate-300 hover:text-white"
                title="Alinear al centro"
              >
                <AlignCenter className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => formatDoc('justifyRight')}
                className="p-1.5 hover:bg-slate-700 rounded-md transition-colors text-slate-300 hover:text-white"
                title="Alinear a la derecha"
              >
                <AlignRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => formatDoc('justifyFull')}
                className="p-1.5 hover:bg-slate-700 rounded-md transition-colors text-slate-300 hover:text-white"
                title="Justificar"
              >
                <AlignJustify className="w-4 h-4" />
              </button>

              <div className="h-4 w-px bg-slate-700 mx-1" />

              <button
                type="button"
                onClick={() => formatDoc('insertOrderedList')}
                className="p-1.5 hover:bg-slate-700 rounded-md transition-colors text-slate-300 hover:text-white"
                title="Lista numerada"
              >
                <ListOrdered className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => formatDoc('insertUnorderedList')}
                className="p-1.5 hover:bg-slate-700 rounded-md transition-colors text-slate-300 hover:text-white"
                title="Lista con viñetas"
              >
                <List className="w-4 h-4" />
              </button>

              <div className="h-4 w-px bg-slate-700 mx-1" />

              <button
                type="button"
                onClick={() => formatDoc('outdent')}
                className="p-1.5 hover:bg-slate-700 rounded-md transition-colors text-slate-300 hover:text-white"
                title="Disminuir sangría"
              >
                <Outdent className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => formatDoc('indent')}
                className="p-1.5 hover:bg-slate-700 rounded-md transition-colors text-slate-300 hover:text-white"
                title="Aumentar sangría"
              >
                <Indent className="w-4 h-4" />
              </button>

              <div className="h-4 w-px bg-slate-700 mx-1" />

              <button
                type="button"
                onClick={() => formatDoc('insertText', '[FIRMA]')}
                className="p-1 px-2 hover:bg-purple-700 bg-purple-900/80 text-purple-200 rounded-md font-mono text-[10px] font-extrabold transition-colors flex items-center gap-1 border border-purple-700/60"
                title="Insertar marcador de Firma Digital [FIRMA]"
              >
                <span>✍️ [FIRMA]</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Paper Workspace Area with Auto Mobile Scaling */}
      <div
        ref={workspaceRef}
        className="p-3 sm:p-8 md:p-12 overflow-x-auto flex flex-col items-center gap-8 min-h-[500px] custom-scrollbar w-full"
      >
        {visiblePages.map((pageHtml, index) => {
          const actualPageIndex = viewMode === 'single' ? currentPageIndex : index;

          return (
            <div
              key={actualPageIndex}
              style={{
                width: `${816 * effectiveScale}px`,
                height: `${1056 * effectiveScale}px`,
              }}
              className="relative flex justify-center items-start shrink-0 transition-all"
            >
              <div
                ref={(el) => {
                  pageRefs.current[actualPageIndex] = el;
                }}
                style={{
                  width: '816px',
                  height: '1056px',
                  transform: `scale(${effectiveScale})`,
                  transformOrigin: 'top center',
                }}
                className="word-paper-sheet bg-white text-slate-900 shadow-2xl shadow-slate-900/25 border border-slate-300 w-[816px] min-w-[816px] max-w-[816px] h-[1056px] max-h-[1056px] p-16 relative font-serif text-sm leading-relaxed rounded-xs overflow-hidden flex flex-col justify-between select-none"
              >
                {/* Persistent Background Image covering FULL page sheet for EVERY single page */}
                {extractedBg && (
                  <div className="absolute inset-0 w-full h-full z-0 pointer-events-none overflow-hidden">
                    <img
                      src={extractedBg}
                      alt={`Fondo Hoja ${actualPageIndex + 1}`}
                      className="w-full h-full object-cover object-center min-w-full min-h-full opacity-90"
                    />
                  </div>
                )}

                {/* Top Header Badge: Page Number & Delete Page Action */}
                <div className="absolute top-4 right-6 left-6 flex items-center justify-between pointer-events-none z-20 select-none">
                  <span className="text-[10px] font-sans font-bold text-slate-400 uppercase tracking-widest bg-white/80 px-2 py-0.5 rounded-md backdrop-blur-xs shadow-2xs border border-slate-200/60">
                    Hoja {actualPageIndex + 1} de {pages.length}
                  </span>

                  <div className="pointer-events-auto flex items-center gap-2">
                    {watermarkText && (
                      <span className="px-2.5 py-0.5 border-2 border-rose-500/40 text-rose-600/50 text-[10px] font-black uppercase tracking-widest rounded-md transform rotate-6 inline-block bg-white/60 backdrop-blur-xs">
                        {watermarkText}
                      </span>
                    )}

                    {editablePages && pages.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleDeletePage(actualPageIndex)}
                        className="p-1 rounded-md bg-white/90 hover:bg-rose-50 border border-slate-200 text-slate-400 hover:text-rose-600 transition-all shadow-2xs"
                        title={`Eliminar Hoja ${actualPageIndex + 1}`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Native Paragraph & Read-Only / Editable Content Div */}
                <div
                  contentEditable={editablePages}
                  suppressContentEditableWarning={true}
                  onKeyDown={(e) => handleKeyDown(e, actualPageIndex)}
                  onBlur={(e) => handlePageBlur(actualPageIndex, e.currentTarget as HTMLDivElement)}
                  className={`relative z-10 word-document-body pt-4 outline-none flex-1 min-h-[800px] max-h-[880px] overflow-y-auto custom-scrollbar ${
                    editablePages ? 'cursor-text select-text' : 'cursor-default select-text'
                  }`}
                  dangerouslySetInnerHTML={{ __html: pageHtml }}
                />

                {/* Footer Page Counter */}
                <div className="absolute bottom-4 left-0 right-0 text-center pointer-events-none select-none z-20">
                  <span className="text-[10px] font-sans text-slate-400 font-medium">
                    - Página {actualPageIndex + 1} -
                  </span>
                </div>
              </div>
            </div>
          );
        })}

        {/* Bottom Quick Add Page Bar - ONLY in Edit Mode */}
        {editablePages && (
          <div className="w-full max-w-[816px] flex justify-center py-2">
            <button
              type="button"
              onClick={handleAddPage}
              className="px-4 py-2 bg-white hover:bg-slate-50 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-blue-600 shadow-md transition-all flex items-center gap-2 group"
            >
              <Plus className="w-4 h-4 text-blue-600 group-hover:scale-125 transition-transform" />
              <span>+ Agregar Nueva Hoja (Salto de Página)</span>
            </button>
          </div>
        )}
      </div>

      {/* Modal / Panel para Gestión de Shortcuts y Variables (Agregar, Editar/Renombrar, Eliminar y Llenar Valores) */}
      {isShortcutsModalOpen && editablePages && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
          <div
            onClick={() => {
              setIsShortcutsModalOpen(false);
              setEditingTokenOriginal(null);
            }}
            className="fixed inset-0 bg-slate-950/75 backdrop-blur-xs"
          />
          <div className="bg-slate-900 border border-slate-700 text-white rounded-3xl p-6 shadow-2xl relative z-10 max-w-2xl w-full space-y-4 max-h-[88vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex flex-wrap items-center justify-between border-b border-slate-800 pb-3 gap-2 flex-shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-white">
                    {isContract ? 'Shortcuts del Contrato' : 'Shortcuts de la Plantilla Legal'}
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    {isContract
                      ? 'Gestiona shortcuts heredados, agrega campos propios y llena sus valores.'
                      : 'Agrega, edita o elimina shortcuts reutilizables para tus documentos.'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Tabs Switcher */}
                <div className="flex bg-slate-800/80 p-1 rounded-xl border border-slate-700">
                  <button
                    type="button"
                    onClick={() => {
                      setShortcutsModalTab('manage');
                      setEditingTokenOriginal(null);
                    }}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 ${
                      shortcutsModalTab === 'manage'
                        ? 'bg-indigo-600 text-white'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Sliders className="w-3.5 h-3.5" />
                    <span>Gestionar ({allTokens.length})</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setShortcutsModalTab('fill');
                      setEditingTokenOriginal(null);
                    }}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 ${
                      shortcutsModalTab === 'fill'
                        ? 'bg-amber-500 text-slate-950 font-black'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Llenar Valores</span>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setIsShortcutsModalOpen(false);
                    setEditingTokenOriginal(null);
                  }}
                  className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* TAB 1: GESTIONAR SHORTCUTS (AGREGAR, EDITAR / RENOMBRAR, ELIMINAR, INSERTAR) */}
            {shortcutsModalTab === 'manage' ? (
              <div className="space-y-4 overflow-y-auto flex-1 custom-scrollbar pr-1">
                {/* 1. Formulario Agregar Nuevo Shortcut */}
                <div className="p-3.5 bg-slate-800/60 rounded-2xl border border-slate-700/80 space-y-2.5">
                  <label className="block text-xs font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Plus className="w-3.5 h-3.5 text-indigo-400" />
                    {isContract ? 'Crear Nuevo Shortcut / Campo Propio para este Contrato' : 'Crear Nuevo Shortcut para esta Plantilla'}
                  </label>

                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="text"
                      value={newShortcutName}
                      onChange={(e) => setNewShortcutName(e.target.value)}
                      placeholder="Ej. NOTARIA, GARANTE, FORMA_PAGO, PLAZO_DIAS"
                      className="flex-1 px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs font-mono text-white focus:ring-2 focus:ring-indigo-500/30 focus:outline-none"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddShortcut();
                        }
                      }}
                    />

                    <div className="flex gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleAddShortcut(undefined, false)}
                        className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-2xs flex items-center gap-1"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Agregar</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleAddShortcut(undefined, true)}
                        className="px-3.5 py-2 bg-slate-700 hover:bg-slate-600 text-indigo-200 rounded-xl text-xs font-bold transition-all flex items-center gap-1"
                        title="Agregar a la lista e insertar de inmediato en el cursor del texto"
                      >
                        <PlusCircle className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Agregar e Insertar</span>
                      </button>
                    </div>
                  </div>
                  <p className="text-[10px] text-slate-400">
                    Se creará en formato automático <code className="text-indigo-300 font-mono">{"{{NOMBRE}}"}</code>
                  </p>
                </div>

                {/* 2. Listado de Shortcuts Existentes */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-400 px-1">
                    <span className="font-bold uppercase tracking-wider text-[10px]">Shortcuts Registrados ({allTokens.length})</span>
                    <span className="text-[10px]">Haz clic en &quot;Insertar&quot; para colocar en el documento</span>
                  </div>

                  {allTokens.length === 0 ? (
                    <div className="p-8 text-center text-slate-400 text-xs italic bg-slate-800/40 rounded-2xl border border-slate-800">
                      No hay shortcuts registrados. Utiliza el formulario arriba para agregar uno nuevo.
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {allTokens.map((tok) => {
                        const inDoc = detectedTokensInHtml.includes(tok);
                        const isEditingThis = editingTokenOriginal === tok;

                        return (
                          <div
                            key={tok}
                            className="p-3 bg-slate-800/50 hover:bg-slate-800/80 rounded-xl border border-slate-700/60 transition-all space-y-2"
                          >
                            {isEditingThis ? (
                              /* Inline Rename Mode */
                              <form onSubmit={handleSaveRenameToken} className="flex items-center gap-2">
                                <input
                                  type="text"
                                  value={editingTokenName}
                                  onChange={(e) => setEditingTokenName(e.target.value)}
                                  className="flex-1 px-3 py-1.5 bg-slate-950 border border-amber-500 rounded-lg text-xs font-mono text-white focus:outline-none"
                                  autoFocus
                                />
                                <button
                                  type="submit"
                                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold flex items-center gap-1"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                  <span>Guardar y Reemplazar</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setEditingTokenOriginal(null)}
                                  className="px-3 py-1.5 bg-slate-700 text-slate-300 rounded-lg text-xs font-bold"
                                >
                                  Cancelar
                                </button>
                              </form>
                            ) : (
                              /* View Mode */
                              <div className="flex items-center justify-between gap-3 flex-wrap">
                                <div className="flex items-center gap-2 min-w-0">
                                  <span className="font-mono text-xs font-black text-amber-400 px-2 py-0.5 bg-amber-950/40 border border-amber-700/40 rounded-lg shrink-0">
                                    {`{{${tok}}}`}
                                  </span>

                                  <span
                                    className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                                      inDoc
                                        ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800'
                                        : 'bg-slate-700/60 text-slate-400 border border-slate-700'
                                    }`}
                                  >
                                    {inDoc ? 'En el texto' : 'Variable registrada'}
                                  </span>
                                </div>

                                <div className="flex items-center gap-1.5">
                                  <button
                                    type="button"
                                    onClick={() => handleInsertToken(tok)}
                                    className="px-2.5 py-1 bg-slate-700 hover:bg-slate-600 text-indigo-300 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors"
                                    title="Insertar {{...}} en el documento"
                                  >
                                    <PlusCircle className="w-3.5 h-3.5" />
                                    <span>Insertar</span>
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => handleStartRenameToken(tok)}
                                    className="px-2.5 py-1 bg-slate-700 hover:bg-slate-600 text-amber-300 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors"
                                    title="Editar / Renombrar este shortcut en todo el documento"
                                  >
                                    <Edit3 className="w-3.5 h-3.5" />
                                    <span>Renombrar</span>
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => handleDeleteToken(tok)}
                                    className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 rounded-lg transition-colors"
                                    title="Eliminar de la lista de shortcuts"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* TAB 2: LLENAR VALORES DE LOS SHORTCUTS */
              <form onSubmit={handleSaveTokenValues} className="space-y-4 overflow-y-auto flex-1 custom-scrollbar pr-1">
                {/* Fast Custom Field Adder in Fill tab */}
                <div className="p-3 bg-slate-800/50 rounded-xl border border-slate-700/60 flex flex-col sm:flex-row items-center justify-between gap-2">
                  <span className="text-[11px] text-slate-300 font-medium">
                    {isContract
                      ? '¿Necesitas un campo propio adicional para este contrato?'
                      : '¿Deseas agregar una variable propia a esta plantilla?'}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      const name = prompt('Nombre del nuevo campo propio (ej. NOTARIA, GARANTE):');
                      if (name) handleAddShortcut(name, false);
                    }}
                    className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold shrink-0 transition-colors flex items-center gap-1 shadow-2xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ Agregar Campo Propio</span>
                  </button>
                </div>

                {allTokens.length === 0 ? (
                  <div className="p-8 text-center text-slate-400 text-xs italic bg-slate-800/40 rounded-2xl border border-slate-800">
                    No hay variables detectadas ni registradas. Agrega shortcuts en la pestaña &quot;Gestionar&quot;.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {allTokens.map((tok) => (
                      <div key={tok} className="space-y-1 p-2.5 bg-slate-800/40 rounded-xl border border-slate-700/60">
                        <div className="flex items-center justify-between">
                          <label className="block text-xs font-bold text-amber-400 uppercase tracking-wider font-mono truncate">
                            {`{{${tok}}}`}
                          </label>
                          {tokenValues[tok] ? (
                            <span className="text-[9px] font-bold text-emerald-400">Lleno</span>
                          ) : (
                            <span className="text-[9px] text-slate-500">Vacío</span>
                          )}
                        </div>
                        <input
                          type="text"
                          value={tokenValues[tok] || ''}
                          onChange={(e) =>
                            setTokenValues((prev) => ({
                              ...prev,
                              [tok]: e.target.value,
                            }))
                          }
                          placeholder={`Valor para ${tok.replace(/_/g, ' ')}...`}
                          className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:ring-2 focus:ring-amber-400/30 focus:outline-none font-medium"
                        />
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex justify-end gap-2 pt-3 border-t border-slate-800 flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => setIsShortcutsModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:bg-slate-800"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={allTokens.length === 0}
                    className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-slate-950 font-extrabold text-xs shadow-md transition-all flex items-center gap-1.5"
                  >
                    <Check className="w-4 h-4" />
                    <span>Guardar y Aplicar Valores</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
});

WordDocumentPaper.displayName = 'WordDocumentPaper';

export default WordDocumentPaper;
