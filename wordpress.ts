// https://github.com/airesvsg/acf-to-rest-api#endpoints
// https://www.wpbeginner.com/wp-tutorials/how-to-create-custom-post-types-in-wordpress/

import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

@Injectable()
export class WordpressProvider {
	WORDPRESS_REST_API_URL: string = 'http://localhost:8081/wordpress/wp-json/wp/v2/';
	postConfig : any = { pretty: true, type: 	'posts' };

  constructor(public http: Http) {}

  /**
  * Get posts
  * @method getPosts
  * @param {Object}	data	Data object. Possible params:

			  context							->	Scope under which the request is made; determines fields present in response. 
					  					 					Default: view
																One of: view, embed, edit
				page								-> 	page of the collection.
																Default: 1
				per_page						->	Maximum number of items to be returned in result set.
															Default: 10
															search	Limit results to those matching a string.
				after								->	Limit response to posts published after a given ISO8601 compliant date.
				author							->	Limit result set to posts assigned to specific authors.
				author_exclude			->	Ensure result set excludes posts assigned to specific authors.
				before							-> 	Limit response to posts published before a given ISO8601 compliant date.
				exclude							->	Ensure result set excludes specific IDs.
				include							->	Limit result set to specific IDs.
				offset							->	Offset the result set by a specific number of items.
				order								->	Order sort attribute ascending or descending.
																Default: desc
																One of: asc, desc
				orderby							->	Sort collection by object attribute.
																Default: date
																One of: author, date, id, include, modified, parent, relevance, slug, title
				slug								->	Limit result set to posts with one or more specific slugs.
				status							->	Limit result set to posts assigned one or more statuses.
																Default: publish
				categories					->	Limit result set to all items that have the specified term assigned in the categories taxonomy.
				categories_exclude	->	Limit result set to all items except those that have the specified term assigned in the categories taxonomy.
				tags								->	Limit result set to all items that have the specified term assigned in the tags taxonomy.
				tags_exclude				-> 	Limit result set to all items except those that have the specified term assigned in the tags taxonomy.
				sticky							-> 	Limit result set to items that are sticky.

		@example
			let params: any = {
	      per_page: 3,
	      page:     1
	    };

	    this.wordpressProvider.getPosts(params)
		    .then(post => {})
		    .catch(error => {});

    @return {Promise} 	posts|error
  */
  getPosts(data: any = {}, configData: any = {}) {
  	let params: string = this.serialize(data);
  	let config: any = { ...this.postConfig, ...configData };

	  return new Promise((resolve, reject) => {
		  this.http.get(
		  		[
				    this.WORDPRESS_REST_API_URL,
				    config.type,
				    params
			    ].join('')
		    )
			  .subscribe(response => {
			  	let posts = response.json();
			  	if(config.pretty) { posts = this.getPrettyPost(posts); };

	        resolve(posts);
	      }, (error) => {
	      	reject(error.json().message);
	      });
		});
	}

	/**
  * Get post
  * @method getPost
  * @param {integer}	id 	Post id
  * @param {Object}		data Data object. Possible params:
				context							->	Scope under which the request is made; determines fields present in response.
																Default: view
																One of: view, embed, edit
				password						->	The password for the post if it is password protected.
		@example
			let params: any = {
	      context: 	'embed'
	    };

	    this.wordpressProvider.getPost(47, params)
		    .then(post => {})
		    .catch(error => {});

    @return {Promise} 	post|error
  */
  getPost(id, data: any = {}, configData: any = {}) {
  	let params: string = this.serialize(data);
  	let config: any = { ...this.postConfig, ...configData };

	  return new Promise((resolve, reject) => {
		  this.http.get(
			    [
			    	this.WORDPRESS_REST_API_URL,
			    	[ config.type, '/' ].join(''),
			    	id,
			    	params
		    	].join('')
		    )
			  .subscribe(response => {
			  	let post = response.json();
			  	if(config.pretty) { post = this.getPrettyPost([ post ])[0]; };
	        resolve(post);
	      }, (error) => {
	        reject(error.json().message);
	      });
		});
	}

	/**
  * Get categories
  * @method getCategories
  * @param {Object}	data	Data object. Possible params:
				context								->	Scope under which the request is made; determines fields present in response.
																	Default: view
																	One of: view, embed, edit
				page									->	Current page of the collection.
																	Default: 1
				per_page							->	Maximum number of items to be returned in result set.
																	Default: 10
				search								->	Limit results to those matching a string.
				exclude								->	Ensure result set excludes specific IDs.
				include								->	Limit result set to specific IDs.
				order									->	Order sort attribute ascending or descending.
																	Default: asc
																	One of: asc, desc
				orderby								->	Sort collection by term attribute.
																	Default: name
																	One of: id, include, name, slug, term_group, description, count

				hide_empty						->	Whether to hide terms not assigned to any posts.
				parent								->	Limit result set to terms assigned to a specific parent.
				post									->	Limit result set to terms assigned to a specific post.
				slug									->	Limit result set to terms with one or more specific slugs.

		@example
			let params: any = {
	      orderby: 	'name',
	      order:    'desc'
	    };

	    this.wordpressProvider.getCategories(params)
		    .then(post => {})
		    .catch(error => {});

    @return {Promise} 	categories|error
  */
  getCategories(data: any = {}) {
  	let params: string = this.serialize(data);

	  return new Promise((resolve, reject) => {
		  this.http.get(
		  		[
				    this.WORDPRESS_REST_API_URL,
				    'categories',
				    params
			    ].join('')
		    )
			  .subscribe(response => {
	        resolve(response.json());
	      }, (error) => {
	      	reject(error.json().message);
	      });
		});
	}

	/**
  * Get category
  * @method getCategory
  * @param {integer}	id 		Category id
  * @param {Object}		data 	Data object. Possible params:
				context							->	Scope under which the request is made; determines fields present in response.
																Default: view
																One of: view, embed, edit
		@example
			let params: any = {
	      context: 	'embed'
	    };

	    this.wordpressProvider.getCategory(1)
		    .then(post => {})
		    .catch(error => {});

    @return {Promise} 	category|error
  */
  getCategory(id, data: any = {}) {
  	let params: string = this.serialize(data);

	  return new Promise((resolve, reject) => {
		  this.http.get(
			    [
			    	this.WORDPRESS_REST_API_URL,
			    	'categories/',
			    	id,
			    	params
		    	].join('')
		    )
			  .subscribe(response => {
	        resolve(response.json());
	      }, (error) => {
	        reject(error.json().message);
	      });
		});
	}

	/**
	 * Serializes the form element so it can be passed to the back end through the url.
	 * The objects properties are the keys and the objects values are the values.
	 * ex: { "a":1, "b":2, "c":3 } would look like ?a=1&b=2&c=3
	 * @param obj - Object to be url encoded
	 */
	serialize(data: any): string {
    let params : any = [];

    for (var key in data) {
	    if (data.hasOwnProperty(key)) {
	    	let keyValuePair = [key, data[key]].join('=');
	    	params.push(keyValuePair);
      }
    }

    params += params.join('&');

	  return params ? '?' + params + '&_embed' : '?_embed';
	}

	/**
  * Get category
  * @method getPrettyPost
  * @param {Object}	post 		Post data
  */
	getPrettyPost(posts: any) {
		for(let i = 0; i < posts.length; i++) {
			let post = posts[i];

			let prettyPost = {
				id: 		post.id,
				slug: 	post.slug,
				status: post.status,
				title: 	post.title.rendered,
				body: 	post.content.rendered,
				image:	post['_embedded']['wp:featuredmedia'][0].media_details.sizes,
				fields:	post.acf
			};

			posts[i] = prettyPost;
		}

		return posts;
	}

}
