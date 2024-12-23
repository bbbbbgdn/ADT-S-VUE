<template>
  <div class="project-page">
    <ImageGallery class="project-gallery-main" />

    <div class="text-container">
      <p>Millions of Ukrainians have been driven from their homes by war. The intimate relationship with their homeland
        was abruptly broken. What does that relationship consist of? What defines a home(land)? With these fundamental
        questions, the exhibition Home(Land) not only zooms in on the war in Ukraine but also on underlying themes such
        as: how important are traditions and heritage? What happens when war takes away this physical and tangible
        connection to a place and its people?</p>

      <p>Dasha Tsapenko together with a team of Ukrainian and Dutch curators brought together designers from Ukraine and
        The Netherlands to explore these questions, based on the belief that new perspectives can be found in design.
        The results of this knowledge exchange demonstrate various sustainable and ethical design practices. Traditional
        crafts and techniques, local materials and innovative knowledge on bio-design and sustainable production
        processes are (re)discovered and connected.</p>
    </div>

    <div class="text-credits">
      <div class="text-columns">
        <div>
          ROLE:<br>Concept, design, curation<br><br>
          COLLABORATORS:<br>Marjo Van Schaik, Nazar Gresko, Fulco Treffers, Olena Oranska<br><br>
          PARTTAKING DESIGNERS:<br>Anna Riabova, Basse Stittgen, Charlotte Visser, Dasha Tsapenko, Marjo van Schaik, Oksana Denusevuch, Oksana Devoe, Ruslana Goncharuk, Sasha Popruga, Sietske Klooster, Stijn van Aardenne<br><br>
          SUPPORT INSTITUTIONS:<br>BDO Eindhoven, Dutch Design Foundation, Embassy of Ukraine in The Netherlands, Embassy of the Netherlands in Ukraine, Rotary Club Netherlands, The New Block, Donations via Voordekunst Crowdfunding, Prince Bernhard Fund, Meta Looms, University of Utrecht<br><br>
          LOCATION:<br>The New Block, Eindhoven, NL
        </div>
        <div>
          PHOTOCREDITS:<br>Dominic van Buul<br><br>
          MEDIA:<br>MYC Couture (New Fashion Narratives #2 | Marres - FASHIONCLASH Festival 2022)
        </div>
      </div>
    </div>

    <div class="button-container">
      <BaseButton to="/shows">Other Shows</BaseButton>
    </div>
    <ImageGallery class="project-gallery"/>
    <ImageGallery class="project-gallery"/>
    <ImageGallery class="project-gallery"/>

  </div>
</template>

<script>
import BaseButton from '../components/BaseButton.vue'
import ImageGallery from '../components/ImageGallery.vue'

export default {
  name: 'ProjectPage',
  components: {
    ImageGallery,
    BaseButton
  }
}
</script>

<style scoped>
.project-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0;
  padding: 0;
}

.text-container {
  margin: 20px 0;
  text-align: center;
}

.project-page ::v-deep(.project-gallery img) {
  height: 20vh;
  width: auto;
  object-fit: cover;
}

.project-page ::v-deep(.project-gallery-main img) {
  height: 650rem;
  width: auto;
  object-fit: cover;
}

p {
  font-size: 34px;
  text-align: left;
  line-height: 42px;
  font-weight: 670;
  text-indent: 70rem;
  font-weight: 600;
}

.text-credits {
  font-size: 22px;
  font-family: 'Saans-SemiBold', sans-serif;
  line-height: 25px;
  text-align: left;
  display: flex;
  justify-content: center;
  margin: 125rem 70rem 200rem 70rem;
  box-sizing: border-box;
}

.text-columns {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: 100rem; 
  max-width: 1400px; 
  width: 100%;
  margin: 0 auto; 
}

.text-columns div {
  flex: 1; 
  text-align: left;
  line-height: 24px;
}

.button-container {
  display: flex;
  justify-content: left;
  align-items: start;
  width: 100%;
  padding: 3rem;
}
</style>

