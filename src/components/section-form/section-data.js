const defaultTemplate = 
`<div class="page-width applied-labs-section">
  {% if section.settings.text-box != blank %}
    <div class="section-header text-center">
      <h2> {{ section.settings.text-box | escape }} </h2>
    </div>
  {% endif %}
  
  <ul class="grid grid--uniform grid--view-items">
    {% for block in section.blocks limit: 3 %}
      <li class="grid__item grid__item--small--one-half medium-up--one-third">
        {% if block.settings.feature_product != blank %}
          {% assign applied-labs-product = all_products[block.settings.feature_product] %}
        	{% if applied-labs-product.id != product.id %}
        	  {% include 'product-card-grid', max_height: 345, product: applied-labs-product, show_vendor: false %}
        	{% endif %}
        {% endif %}
      </li>
    {% endfor %}
  </ul> 
</div>`;

const sectionSchema = {
  "name": "More Products",
  "max_blocks": 3,
  "settings": [
    {
          "id": "text-box",
          "type": "text",
          "label": "Title",
    }
  ],
  "blocks": [
    {
      "type": "select",
      "name": "Product",
      "settings": [
        {
          "type": "product",
           "id": "feature_product",
           "label": "Feature product"
        }
      ]
    }
  ]
}

const sectionData = {
	defaultTemplate,
  sectionSchema
}

export default sectionData;