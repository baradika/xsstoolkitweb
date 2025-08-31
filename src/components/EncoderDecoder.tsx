import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Copy, ArrowUpDown, RotateCcw } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface EncodingOperation {
  name: string
  apply: (text: string) => string
}

const encodingOperations: Record<string, EncodingOperation> = {
  // Case Variations
  capitalizeFirst: {
    name: "Capitalize First Letter",
    apply: (text) => text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()
  },
  uppercase: {
    name: "UPPERCASE",
    apply: (text) => text.toUpperCase()
  },
  mixedCase: {
    name: "MiXeD cAsE",
    apply: (text) => text.split('').map((char, i) => i % 2 === 0 ? char.toLowerCase() : char.toUpperCase()).join('')
  },
  randomCase: {
    name: "Random Case",
    apply: (text) => text.split('').map(char => Math.random() > 0.5 ? char.toUpperCase() : char.toLowerCase()).join('')
  },
  
  // Whitespace & Special Characters
  spaceToNbsp: {
    name: "Space to &nbsp;",
    apply: (text) => text.replace(/ /g, '&nbsp;')
  },
  spaceToTab: {
    name: "Space to Tab",
    apply: (text) => text.replace(/ /g, '\t')
  },
  spaceToNewline: {
    name: "Space to Newline",
    apply: (text) => text.replace(/ /g, '\n')
  },
  spaceToCarriageReturn: {
    name: "Space to Carriage Return",
    apply: (text) => text.replace(/ /g, '\r')
  },
  spaceToFormFeed: {
    name: "Space to Form Feed",
    apply: (text) => text.replace(/ /g, '\f')
  },
  
  // Bypass Techniques
  splitKeywords: {
    name: "Split Keywords (Trojan)",
    apply: (text) => text.replace(/script/gi, 'scr</script>ipt').replace(/alert/gi, 'ale</script>rt')
  },
  nonRequiredAttributes: {
    name: "Non-required Attributes",
    apply: (text) => text.replace(/<(\w+)/g, '<$1 id="x"')
  },
  commentInsertion: {
    name: "Comment Insertion",
    apply: (text) => text.replace(/script/gi, 'scr/**/ipt').replace(/alert/gi, 'ale/**/rt')
  },
  zeroWidthChars: {
    name: "Zero-width Characters",
    apply: (text) => text.split('').join('\u200B')
  },
  stringConcat: {
    name: "String Concat",
    apply: (text) => text.replace(/alert/gi, 'ale"+"rt').replace(/script/gi, 'scr"+"ipt')
  },
  fromCharCode: {
    name: "FromCharCode Obfuscation",
    apply: (text) => `String.fromCharCode(${text.split('').map(c => c.charCodeAt(0)).join(',')})`
  },
  
  // Advanced Options
  homographSubstitution: {
    name: "Homograph Substitution",
    apply: (text) => text.replace(/a/g, 'а').replace(/e/g, 'е').replace(/o/g, 'о') // Cyrillic lookalikes
  },
  rtlOverride: {
    name: "RTL Override",
    apply: (text) => '\u202E' + text + '\u202C'
  },
  tripleEncoding: {
    name: "Triple Encoding",
    apply: (text) => encodeURIComponent(encodeURIComponent(encodeURIComponent(text)))
  },
  preserveLength: {
    name: "Preserve Length",
    apply: (text) => text.replace(/\s/g, '\u00A0') // Non-breaking space
  }
}

export default function EncoderDecoder() {
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")
  const [encodingChain, setEncodingChain] = useState<string[]>([])
  const [selectedOperations, setSelectedOperations] = useState<Record<string, boolean>>({})
  const { toast } = useToast()

  const applyEncoding = useCallback(() => {
    if (!input.trim()) {
      toast({
        title: "Error",
        description: "Please enter text to encode",
        variant: "destructive",
      })
      return
    }

    const selectedOps = Object.entries(selectedOperations)
      .filter(([_, selected]) => selected)
      .map(([key, _]) => key)

    if (selectedOps.length === 0) {
      toast({
        title: "Error", 
        description: "Please select at least one encoding operation",
        variant: "destructive",
      })
      return
    }

    let result = input
    const appliedOperations: string[] = []

    selectedOps.forEach(opKey => {
      const operation = encodingOperations[opKey]
      if (operation) {
        result = operation.apply(result)
        appliedOperations.push(operation.name)
      }
    })

    setOutput(result)
    setEncodingChain(appliedOperations)
    
    toast({
      title: "Encoding Applied",
      description: `Applied ${appliedOperations.length} operation(s)`,
    })
  }, [input, selectedOperations, toast])

  const autoDecodeCommon = useCallback(() => {
    if (!input.trim()) {
      toast({
        title: "Error",
        description: "Please enter text to decode",
        variant: "destructive",
      })
      return
    }

    let result = input
    const decodingOperations: string[] = []

    // Try URL decoding
    try {
      const decoded = decodeURIComponent(result)
      if (decoded !== result) {
        result = decoded
        decodingOperations.push("URL Decode")
      }
    } catch (e) {
      // Ignore decoding errors
    }

    // Try HTML entity decoding
    const htmlDecoded = result
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#x27;/g, "'")
      .replace(/&nbsp;/g, ' ')

    if (htmlDecoded !== result) {
      result = htmlDecoded
      decodingOperations.push("HTML Entity Decode")
    }

    // Try Base64 decoding
    try {
      const base64Decoded = atob(result)
      if (base64Decoded !== result && /^[a-zA-Z0-9+/]*={0,2}$/.test(result)) {
        result = base64Decoded
        decodingOperations.push("Base64 Decode")
      }
    } catch (e) {
      // Ignore decoding errors
    }

    setOutput(result)
    setEncodingChain(decodingOperations)
    
    toast({
      title: "Auto-Decode Applied",
      description: `Applied ${decodingOperations.length} decoding operation(s)`,
    })
  }, [input, toast])

  const clearAll = useCallback(() => {
    setInput("")
    setOutput("")
    setEncodingChain([])
    setSelectedOperations({})
  }, [])

  const copyToClipboard = useCallback(async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast({
        title: "Copied!",
        description: `${label} copied to clipboard`,
      })
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to copy to clipboard",
        variant: "destructive",
      })
    }
  }, [toast])

  const swapInputOutput = useCallback(() => {
    const temp = input
    setInput(output)
    setOutput(temp)
    setEncodingChain([])
  }, [input, output])

  const toggleOperation = (key: string) => {
    setSelectedOperations(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

  const operationGroups = [
    {
      title: "CASE VARIATIONS",
      operations: ["capitalizeFirst", "uppercase", "mixedCase", "randomCase"]
    },
    {
      title: "WHITESPACE & KARAKTER KHUSUS", 
      operations: ["spaceToNbsp", "spaceToTab", "spaceToNewline", "spaceToCarriageReturn", "spaceToFormFeed"]
    },
    {
      title: "BYPASS TECHNIQUES",
      operations: ["splitKeywords", "nonRequiredAttributes", "commentInsertion", "zeroWidthChars", "stringConcat", "fromCharCode"]
    },
    {
      title: "ADVANCED OPTIONS",
      operations: ["homographSubstitution", "rtlOverride", "tripleEncoding", "preserveLength"]
    }
  ]

  return (
    <div className="min-h-screen bg-background text-foreground p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-4 md:space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl md:text-4xl font-bold text-primary">XSS Payload Encoder/Decoder</h1>
          <p className="text-sm md:text-base text-muted-foreground">
            Advanced payload manipulation for XSS testing
          </p>
        </div>

        {/* Encoding Chain Display */}
        <Card className="bg-chain-bg border-chain-border">
          <CardHeader className="p-4 md:p-6">
            <CardTitle className="text-chain-text text-base md:text-lg">Encoding Chain</CardTitle>
          </CardHeader>
          <CardContent className="p-4 md:p-6 pt-0">
            {encodingChain.length > 0 ? (
              <div className="flex flex-wrap gap-1 md:gap-2">
                {encodingChain.map((operation, index) => (
                  <Badge 
                    key={index} 
                    variant="outline" 
                    className="border-chain-border text-chain-text text-xs md:text-sm"
                  >
                    {operation}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm md:text-base">No operations performed</p>
            )}
          </CardContent>
        </Card>

        {/* Input/Output Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {/* Input */}
          <Card>
            <CardHeader className="p-4 md:p-6">
              <CardTitle className="flex justify-between items-center text-base md:text-lg">
                Input
                <span className="text-xs md:text-sm text-muted-foreground">{input.length} chars</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 md:p-6 space-y-3 md:space-y-4">
              <Textarea
                placeholder="Enter your payload here..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="min-h-[120px] md:min-h-[200px] font-mono text-sm md:text-base"
              />
              <div className="flex flex-col sm:flex-row gap-2">
                <Button onClick={applyEncoding} className="flex-1 text-xs md:text-sm">
                  Encode
                </Button>
                <Button onClick={autoDecodeCommon} variant="success" className="flex-1 text-xs md:text-sm">
                  Auto-Decode
                </Button>
                <Button onClick={clearAll} variant="outline" className="text-xs md:text-sm">
                  <RotateCcw className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
                  Clear
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Output */}
          <Card>
            <CardHeader className="p-4 md:p-6">
              <CardTitle className="flex justify-between items-center text-base md:text-lg">
                Output
                <span className="text-xs md:text-sm text-muted-foreground">{output.length} chars</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 md:p-6 space-y-3 md:space-y-4">
              <Textarea
                placeholder="Processed output will appear here..."
                value={output}
                readOnly
                className="min-h-[120px] md:min-h-[200px] font-mono bg-muted text-sm md:text-base"
              />
              <div className="flex flex-col sm:flex-row gap-2">
                <Button
                  onClick={() => copyToClipboard(output, "Output")}
                  variant="outline"
                  className="flex-1 text-xs md:text-sm"
                  disabled={!output}
                >
                  <Copy className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
                  Copy Results
                </Button>
                <Button
                  onClick={swapInputOutput}
                  variant="outline"
                  className="text-xs md:text-sm"
                  disabled={!output}
                >
                  <ArrowUpDown className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
                  Swap
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Encoding Options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {operationGroups.map((group) => (
            <Card key={group.title}>
              <CardHeader className="p-4 md:p-6">
                <CardTitle className="text-xs md:text-sm font-medium text-muted-foreground">
                  {group.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 md:p-6 pt-0 space-y-2 md:space-y-3">
                {group.operations.map((opKey) => {
                  const operation = encodingOperations[opKey]
                  return (
                    <div key={opKey} className="flex items-center space-x-2">
                      <Checkbox
                        id={opKey}
                        checked={selectedOperations[opKey] || false}
                        onCheckedChange={() => toggleOperation(opKey)}
                        className="h-3 w-3 md:h-4 md:w-4"
                      />
                      <label
                        htmlFor={opKey}
                        className="text-xs md:text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                      >
                        {operation.name}
                      </label>
                    </div>
                  )
                })}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}