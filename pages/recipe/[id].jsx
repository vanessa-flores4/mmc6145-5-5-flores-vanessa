import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { getRecipe } from '../../util/recipe'
import styles from '../../styles/recipe.module.css'

// TODO: destructure id parameter from argument passed to getServerSideProps
export async function getServerSideProps({params}) {
  const props = {}
  const { id } = params
  // TODO: call getRecipe using id parameter and pass return value as recipeInfo prop
  const recipeInfo = await getRecipe(id)
  props.recipeInfo = recipeInfo
  return { props }
}

export default function Recipe({recipeInfo}) {
  return (
    <>
      <Head>
        <title>{recipeInfo ? recipeInfo.title : 'Recipe Not Found'}</title>
        <meta name="description" content={recipeInfo ? 'Recipe info for ' + recipeInfo.title : 'Recipe Not Found Page'} />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🍴</text></svg>"/>
      </Head>

      {/* TODO: Render RecipeInfo component with recipeInfo prop, OR RecipeError if no recipe */}
      {recipeInfo ? 
      <RecipeInfo 
      title={recipeInfo.title}
      image={recipeInfo.image}
      readyInMinutes={recipeInfo.readyInMinutes}
      instructions={recipeInfo.instructions}
      summary={recipeInfo.summary}
      extendedIngredients={recipeInfo.extendedIngredients}
      /> : <RecipeError/>}

      <Link className={styles.return} href="/search">Return to Search</Link>
    </>
  )
}

function RecipeInfo({
  image,
  title,
  readyInMinutes,
  instructions,
  summary,
  extendedIngredients
}) {
  return (
    <main className={styles.container}>
      <h1>{title}</h1>
      <Image src={image} width={556} height={370} alt={title} className={styles.recipeImg}/>
      <div className={styles.notes}>
        <p>Time to Make: {readyInMinutes}min</p>
      </div>
      <div className={styles.infoGroup}>
        <div className={styles.description}>
          <h2>Description</h2>
          <div dangerouslySetInnerHTML={{__html: summary.replace(/(href=")[\w-/:\.]+-([\d]+)/g, "$1" + '/recipe/' + "$2")}}></div>
        </div>
        <div className={styles.ingredients}>
          <h2>Ingredients</h2>
          <ul>
            {extendedIngredients.map((ing, i) => <li key={i}>{ing.original}</li>)}
          </ul>
        </div>
      </div>
      <h2>Steps</h2>
      <div className={styles.instructions} dangerouslySetInnerHTML={{__html: instructions}}></div>
    </main>
  )
}

function RecipeError() {
  return (
    <h1 className={styles.notFound}>Recipe Not Found!</h1>
  )
}