import { GoogleGenerativeAI } from '@google/generative-ai'
import * as fs from 'fs'
import * as path from 'path'

const API_KEY = process.env.GOOGLE_API_KEY || ''

const genAI = new GoogleGenerativeAI(API_KEY)

interface ProductInfo {
  filename: string
  productName: string
  market: 'domestic' | 'overseas'
  imageNumber: number
}

async function extractProductNameFromImage(imagePath: string): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro-vision' })

    // 이미지를 base64로 변환
    const imageBuffer = fs.readFileSync(imagePath)
    const base64Image = imageBuffer.toString('base64')

    const prompt = `이 이미지는 제품 상세페이지입니다.
이미지의 첫 번째 라인(맨 위)에 있는 제품명을 정확히 추출해주세요.
제품명만 출력하고, 다른 설명은 하지 마세요.
한글 제품명이 있으면 한글로, 영문 제품명이 있으면 영문으로 출력하세요.`

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: base64Image,
          mimeType: 'image/jpeg'
        }
      }
    ])

    const response = result.response
    const productName = response.text().trim()

    return productName
  } catch (error: any) {
    console.error(`❌ 이미지 분석 오류 (${path.basename(imagePath)}):`, error.message)
    return ''
  }
}

async function main() {
  console.log('🔍 제품 상세 이미지에서 제품명 추출 시작...\n')

  const imagesDir = path.join(process.cwd(), 'public', 'products', 'detail-images')
  const files = fs.readdirSync(imagesDir)
    .filter(f => f.endsWith('.jpg'))
    .sort()

  console.log(`📁 총 ${files.length}개의 이미지 파일 발견\n`)

  const products: ProductInfo[] = []
  const seenNames = new Map<string, number>()

  for (let i = 0; i < files.length; i++) {
    const filename = files[i]
    const imagePath = path.join(imagesDir, filename)

    // 파일명에서 정보 추출
    const isDomestic = filename.includes('(국내)')
    const isOverseas = filename.includes('(해외)')
    const market: 'domestic' | 'overseas' = isDomestic ? 'domestic' : 'overseas'

    // 이미지 번호 추출
    const numberMatch = filename.match(/사본\s*(\d+)/)
    const imageNumber = numberMatch ? parseInt(numberMatch[1]) : 1

    console.log(`[${i + 1}/${files.length}] 분석 중: ${filename}`)
    console.log(`   시장: ${market === 'domestic' ? '국내' : '해외'}, 번호: ${imageNumber}`)

    // AI로 제품명 추출
    const extractedName = await extractProductNameFromImage(imagePath)

    if (!extractedName) {
      console.log(`   ⚠️  제품명 추출 실패, 기본 이름 사용\n`)
      continue
    }

    // 중복 처리
    let productName = extractedName
    if (seenNames.has(extractedName)) {
      const count = seenNames.get(extractedName)! + 1
      seenNames.set(extractedName, count)
      productName = `${extractedName} ${count}`
      console.log(`   ⚠️  중복 감지: "${extractedName}" → "${productName}"`)
    } else {
      seenNames.set(extractedName, 1)
    }

    products.push({
      filename,
      productName,
      market,
      imageNumber
    })

    console.log(`   ✅ 제품명: "${productName}"\n`)

    // API Rate Limit 방지 (1초 대기)
    await new Promise(resolve => setTimeout(resolve, 1000))
  }

  // 결과를 JSON 파일로 저장
  const outputPath = path.join(process.cwd(), 'scripts', 'product-names.json')
  fs.writeFileSync(outputPath, JSON.stringify(products, null, 2), 'utf-8')

  console.log('🎉 제품명 추출 완료!')
  console.log(`📄 결과 저장: ${outputPath}\n`)

  console.log('📊 추출된 제품 목록:\n')
  products.forEach((p, idx) => {
    console.log(`${idx + 1}. ${p.productName} (${p.market === 'domestic' ? '국내' : '해외'})`)
  })

  console.log(`\n총 ${products.length}개 제품 추출 완료`)
}

main()
  .catch((e) => {
    console.error('\n❌ 에러 발생:', e)
    process.exit(1)
  })
